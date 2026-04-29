"use client";

import { useState } from "react";
import { HelpCircle, Plus, Trash2, GripVertical, Check, X, ListChecks, Shuffle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  prompt: string;
  type: "multiple" | "single" | "truefalse";
  options: string[];
  correct: number[];
  points: number;
}

export function QuizBlock({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const quiz = (() => {
    try {
      const d = JSON.parse(content || "{}");
      return {
        questions: d.questions || [],
        passingScore: d.passingScore || 70,
        randomize: d.randomize || false,
        timeLimitMin: d.timeLimitMin || null,
      };
    } catch {
      return { questions: [], passingScore: 70, randomize: false, timeLimitMin: null };
    }
  })();

  const persist = (updates: any) => {
    onChange(JSON.stringify({ ...quiz, ...updates }));
  };

  const addQuestion = () => {
    const q: QuizQuestion = {
      id: `q-${Date.now()}`,
      prompt: "",
      type: "multiple",
      options: ["", ""],
      correct: [],
      points: 1,
    };
    persist({ questions: [...quiz.questions, q] });
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    persist({
      questions: quiz.questions.map((q: QuizQuestion) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    });
  };

  const removeQuestion = (id: string) => {
    persist({ questions: quiz.questions.filter((q: QuizQuestion) => q.id !== id) });
  };

  const addOption = (questionId: string) => {
    persist({
      questions: quiz.questions.map((q: QuizQuestion) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      ),
    });
  };

  const updateOption = (questionId: string, idx: number, val: string) => {
    persist({
      questions: quiz.questions.map((q: QuizQuestion) => {
        if (q.id !== questionId) return q;
        const opts = [...q.options];
        opts[idx] = val;
        return { ...q, options: opts };
      }),
    });
  };

  const toggleCorrect = (questionId: string, idx: number) => {
    persist({
      questions: quiz.questions.map((q: QuizQuestion) => {
        if (q.id !== questionId) return q;
        const correct = q.correct.includes(idx)
          ? q.correct.filter((i: number) => i !== idx)
          : [...q.correct, idx];
        return { ...q, correct };
      }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-2">
          <ListChecks className="h-3.5 w-3.5 text-ink-muted" />
          <span className="text-ink-muted">{quiz.questions.length} questions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-ink-muted">Pass:</span>
          <input
            type="number"
            value={quiz.passingScore}
            onChange={(e) => persist({ passingScore: parseInt(e.target.value) || 70 })}
            className="w-14 h-7 text-center rounded-lg border border-line bg-paper text-[11px] font-medium text-ink"
          />
          <span className="text-ink-muted">%</span>
        </div>
        <label className="flex items-center gap-1.5 text-ink-muted cursor-pointer">
          <input
            type="checkbox"
            checked={quiz.randomize}
            onChange={(e) => persist({ randomize: e.target.checked })}
            className="rounded border-line"
          />
          <Shuffle className="h-3 w-3" /> Randomize
        </label>
        <label className="flex items-center gap-1.5 text-ink-muted">
          <Clock className="h-3 w-3" />
          <input
            type="number"
            placeholder="min"
            value={quiz.timeLimitMin || ""}
            onChange={(e) => persist({ timeLimitMin: e.target.value ? parseInt(e.target.value) : null })}
            className="w-12 h-7 text-center rounded-lg border border-line bg-paper text-[11px] font-medium text-ink"
          />
        </label>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q: QuizQuestion, qi: number) => (
          <div
            key={q.id}
            className="bg-paper-soft border border-line rounded-xl p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 pt-1">
                <GripVertical className="h-3.5 w-3.5 text-ink-muted cursor-grab" />
                <span className="text-[11px] font-semibold text-ink-muted">Q{qi + 1}</span>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Question prompt…"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-line bg-paper text-[13px] text-ink placeholder:text-ink-muted focus:border-indigo-400 outline-none"
                />

                {/* Options */}
                <div className="space-y-1.5">
                  {q.options.map((opt: string, oi: number) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCorrect(q.id, oi)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          q.correct.includes(oi)
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-line hover:border-indigo-300"
                        }`}
                      >
                        {q.correct.includes(oi) && <Check className="h-2.5 w-2.5 text-white" />}
                      </button>
                      <input
                        type="text"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(q.id, oi, e.target.value)}
                        className="flex-1 h-8 px-2 rounded-lg border border-line bg-paper text-[12px] text-ink placeholder:text-ink-muted focus:border-indigo-400 outline-none"
                      />
                      {q.options.length > 2 && (
                        <button
                          onClick={() => {
                            const opts = q.options.filter((_: string, i: number) => i !== oi);
                            updateQuestion(q.id, { options: opts });
                          }}
                          className="p-1 rounded text-ink-muted hover:text-rose-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(q.id)}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    + Add option
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeQuestion(q.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 text-ink-muted hover:text-rose-500 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="w-full border-2 border-dashed border-line rounded-xl py-3 flex items-center justify-center gap-2 text-[12px] font-medium text-ink-muted hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
      >
        <Plus className="h-3.5 w-3.5" /> Add Question
      </button>
    </div>
  );
}
