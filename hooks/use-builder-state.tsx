"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BuilderSaveStatus } from "@/components/builder";

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function useBuilderState<T extends Record<string, any>>({ initialData, save, debounceMs = 1200 }: { initialData: T; save: (fields: Partial<T>) => Promise<unknown>; debounceMs?: number }) {
  const [history, setHistory] = useState<HistoryState<T>>({ past: [], present: initialData, future: [] });
  const [dirtyFields, setDirtyFields] = useState<Set<keyof T>>(new Set());
  const [saveStatus, setSaveStatus] = useState<BuilderSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dirtyRef = useRef(dirtyFields);
  const dataRef = useRef(history.present);

  useEffect(() => {
    dirtyRef.current = dirtyFields;
  }, [dirtyFields]);

  useEffect(() => {
    dataRef.current = history.present;
  }, [history.present]);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setHistory((current) => ({
      past: [...current.past, current.present].slice(-40),
      present: { ...current.present, [field]: value },
      future: [],
    }));
    setDirtyFields((current) => new Set(current).add(field));
    setSaveStatus("dirty");
    setError(null);
  }, []);

  const setFields = useCallback((fields: Partial<T>) => {
    setHistory((current) => ({
      past: [...current.past, current.present].slice(-40),
      present: { ...current.present, ...fields },
      future: [],
    }));
    setDirtyFields((current) => {
      const next = new Set(current);
      Object.keys(fields).forEach((field) => next.add(field as keyof T));
      return next;
    });
    setSaveStatus("dirty");
    setError(null);
  }, []);

  const saveNow = useCallback(async () => {
    const fields = dirtyRef.current;
    if (fields.size === 0) return;
    const payload: Partial<T> = {};
    fields.forEach((field) => {
      payload[field] = dataRef.current[field];
    });
    setSaveStatus("saving");
    try {
      await save(payload);
      setDirtyFields(new Set());
      setLastSavedAt(new Date());
      setSaveStatus("saved");
      setError(null);
      window.setTimeout(() => setSaveStatus((status) => (status === "saved" ? "idle" : status)), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaveStatus("error");
    }
  }, [save]);

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future],
      };
    });
    setSaveStatus("dirty");
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      const next = current.future[0];
      if (!next) return current;
      return {
        past: [...current.past, current.present].slice(-40),
        present: next,
        future: current.future.slice(1),
      };
    });
    setSaveStatus("dirty");
  }, []);

  useEffect(() => {
    if (dirtyFields.size === 0) return;
    const timer = window.setTimeout(() => void saveNow(), debounceMs);
    return () => window.clearTimeout(timer);
  }, [debounceMs, dirtyFields, saveNow]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current.size === 0) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveNow();
      }
      if (event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
      } else if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [redo, saveNow, undo]);

  return useMemo(() => ({
    data: history.present,
    setField,
    setFields,
    saveNow,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    dirtyFields,
    saveStatus,
    lastSavedAt,
    error,
  }), [dirtyFields, error, history.future.length, history.past.length, history.present, lastSavedAt, redo, saveNow, saveStatus, setField, setFields, undo]);
}
