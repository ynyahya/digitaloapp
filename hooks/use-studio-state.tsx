"use client";

import { createContext, useContext, useReducer, useCallback, useRef, useEffect, ReactNode } from "react";
import { updateProductFields } from "@/lib/actions/studio";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface StudioProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  coverImage: string | null;
  gallery: string | null; // JSON string
  type: string;
  status: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  pricingModel: string;
  bestSeller: boolean;
  instantDelivery: boolean;
  lifetimeUpdates: boolean;
  included: string | null;
  highlights: string | null;
  faq: string | null;
  comparison: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  customSlug: string | null;
  refundPolicy: string;
  blockOrder: string | null;
  bonuses: string | null;
  discountCodes: string | null;
  categoryId: string | null;
  publishedAt: string | null;
  
  // Relations
  category: { id: string; name: string; slug: string } | null;
  licenses: Array<{
    id: string;
    name: string;
    priceCents: number;
    description: string | null;
    perks: string | null;
  }>;
  files: Array<{
    id: string;
    filename: string;
    storageKey: string;
    sizeBytes: number | null;
    version: string;
  }>;
  tags: Array<{
    tag: { id: string; name: string; slug: string };
  }>;
  creator: {
    id: string;
    handle: string;
    displayName: string;
    avatarUrl: string | null;
    verified: boolean;
  };
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    role: string | null;
    user: { name: string | null; image: string | null };
  }>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface StudioState {
  product: StudioProduct;
  dirtyFields: Set<string>;
  saveStatus: SaveStatus;
  undoStack: Array<Partial<StudioProduct>>;
  redoStack: Array<Partial<StudioProduct>>;
  lastSavedAt: Date | null;
}

type StudioAction =
  | { type: "SET_FIELD"; field: string; value: any }
  | { type: "SET_FIELDS"; fields: Record<string, any> }
  | { type: "SET_PRODUCT"; product: StudioProduct }
  | { type: "MARK_SAVING" }
  | { type: "MARK_SAVED" }
  | { type: "MARK_ERROR" }
  | { type: "CLEAR_DIRTY" }
  | { type: "UNDO" }
  | { type: "REDO" };

const MAX_UNDO = 20;

// ────────────────────────────────────────────────────────────
// Reducer
// ────────────────────────────────────────────────────────────

function studioReducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case "SET_FIELD": {
      const prev: Partial<StudioProduct> = { [action.field]: (state.product as any)[action.field] };
      return {
        ...state,
        product: { ...state.product, [action.field]: action.value },
        dirtyFields: new Set([...state.dirtyFields, action.field]),
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), prev],
        redoStack: [],
        saveStatus: "idle",
      };
    }

    case "SET_FIELDS": {
      const prev: Partial<StudioProduct> = {};
      for (const key of Object.keys(action.fields)) {
        (prev as any)[key] = (state.product as any)[key];
      }
      return {
        ...state,
        product: { ...state.product, ...action.fields },
        dirtyFields: new Set([...state.dirtyFields, ...Object.keys(action.fields)]),
        undoStack: [...state.undoStack.slice(-MAX_UNDO + 1), prev],
        redoStack: [],
        saveStatus: "idle",
      };
    }

    case "SET_PRODUCT":
      return { ...state, product: action.product, dirtyFields: new Set(), saveStatus: "idle" };

    case "MARK_SAVING":
      return { ...state, saveStatus: "saving" };

    case "MARK_SAVED":
      return { ...state, saveStatus: "saved", dirtyFields: new Set(), lastSavedAt: new Date() };

    case "MARK_ERROR":
      return { ...state, saveStatus: "error" };

    case "CLEAR_DIRTY":
      return { ...state, dirtyFields: new Set() };

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const lastChange = state.undoStack[state.undoStack.length - 1];
      const currentSnapshot: Partial<StudioProduct> = {};
      for (const key of Object.keys(lastChange)) {
        (currentSnapshot as any)[key] = (state.product as any)[key];
      }
      return {
        ...state,
        product: { ...state.product, ...lastChange },
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, currentSnapshot],
        dirtyFields: new Set([...state.dirtyFields, ...Object.keys(lastChange)]),
        saveStatus: "idle",
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const nextChange = state.redoStack[state.redoStack.length - 1];
      const currentSnapshot: Partial<StudioProduct> = {};
      for (const key of Object.keys(nextChange)) {
        (currentSnapshot as any)[key] = (state.product as any)[key];
      }
      return {
        ...state,
        product: { ...state.product, ...nextChange },
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, currentSnapshot],
        dirtyFields: new Set([...state.dirtyFields, ...Object.keys(nextChange)]),
        saveStatus: "idle",
      };
    }

    default:
      return state;
  }
}

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────

interface StudioContextValue {
  state: StudioState;
  product: StudioProduct;
  saveStatus: SaveStatus;
  setField: (field: string, value: any) => void;
  setFields: (fields: Record<string, any>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  forceSave: () => Promise<void>;
  isCopilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}

// ────────────────────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────────────────────

export function StudioProvider({ 
  initialProduct, 
  children 
}: { 
  initialProduct: StudioProduct; 
  children: ReactNode; 
}) {
  const [state, dispatch] = useReducer(studioReducer, {
    product: initialProduct,
    dirtyFields: new Set<string>(),
    saveStatus: "idle" as SaveStatus,
    undoStack: [],
    redoStack: [],
    lastSavedAt: null,
  });

  const [isCopilotOpen, setCopilotOpen] = useReducer((state: boolean, action: boolean | "toggle") => {
    if (action === "toggle") return !state;
    return action;
  }, false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(state.dirtyFields);
  const productRef = useRef(state.product);
  dirtyRef.current = state.dirtyFields;
  productRef.current = state.product;

  // Debounced auto-save (2s after last change)
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const dirty = dirtyRef.current;
      if (dirty.size === 0) return;

      dispatch({ type: "MARK_SAVING" });
      try {
        const fieldsToSave: Record<string, any> = {};
        for (const field of dirty) {
          fieldsToSave[field] = (productRef.current as any)[field];
        }
        await updateProductFields(productRef.current.id, fieldsToSave);
        dispatch({ type: "MARK_SAVED" });
      } catch (err) {
        console.error("Auto-save failed:", err);
        dispatch({ type: "MARK_ERROR" });
      }
    }, 2000);
  }, []);

  const setField = useCallback((field: string, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
    scheduleSave();
  }, [scheduleSave]);

  const setFields = useCallback((fields: Record<string, any>) => {
    dispatch({ type: "SET_FIELDS", fields });
    scheduleSave();
  }, [scheduleSave]);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
    scheduleSave();
  }, [scheduleSave]);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
    scheduleSave();
  }, [scheduleSave]);

  const forceSave = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const dirty = dirtyRef.current;
    if (dirty.size === 0) return;

    dispatch({ type: "MARK_SAVING" });
    try {
      const fieldsToSave: Record<string, any> = {};
      for (const field of dirty) {
        fieldsToSave[field] = (productRef.current as any)[field];
      }
      await updateProductFields(productRef.current.id, fieldsToSave);
      dispatch({ type: "MARK_SAVED" });
    } catch (err) {
      console.error("Force save failed:", err);
      dispatch({ type: "MARK_ERROR" });
    }
  }, []);

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+S (save)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        scheduleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        scheduleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        forceSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        setCopilotOpen("toggle");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scheduleSave, forceSave]);

  // Warn on unsaved changes before navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <StudioContext.Provider value={{
      state,
      product: state.product,
      saveStatus: state.saveStatus,
      setField,
      setFields,
      undo,
      redo,
      canUndo: state.undoStack.length > 0,
      canRedo: state.redoStack.length > 0,
      forceSave,
      isCopilotOpen,
      setCopilotOpen: (open: boolean) => setCopilotOpen(open),
      toggleCopilot: () => setCopilotOpen("toggle"),
    }}>
      {children}
    </StudioContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

/** Parse JSON field safely, returning fallback on error */
export function parseJsonField<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** Format cents to currency display */
export function formatStudioPrice(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** Supported currencies */
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
] as const;

/** Pricing models */
export const PRICING_MODELS = [
  { value: "ONE_TIME", label: "One-time Purchase", desc: "Customer pays once for lifetime access" },
  { value: "SUBSCRIPTION", label: "Subscription", desc: "Recurring payment (monthly/yearly)" },
  { value: "PWYW", label: "Pay What You Want", desc: "Customer sets their own price" },
  { value: "FREE", label: "Free", desc: "No payment required" },
] as const;

/** Refund policies */
export const REFUND_POLICIES = [
  { value: "30_DAY", label: "30-Day Money-Back Guarantee" },
  { value: "14_DAY", label: "14-Day Money-Back Guarantee" },
  { value: "NO_REFUND", label: "No Refunds (All Sales Final)" },
  { value: "CUSTOM", label: "Custom Policy" },
] as const;
