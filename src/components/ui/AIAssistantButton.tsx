"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIAssistantButtonProps {
  currentText: string;
  onUpdate: (improvedText: string) => void;
  type: "summary" | "experience";
  locale: string;
}

export function AIAssistantButton({ currentText, onUpdate, type, locale }: AIAssistantButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    if (!currentText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText,
          type,
          language: locale
        }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();
      if (data.improvedText) {
        onUpdate(data.improvedText);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleImprove}
      disabled={loading || !currentText.trim()}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ 
        background: "var(--primary-50)", 
        color: "var(--primary-600)",
        border: "1px solid var(--primary-200)"
      }}
      title="Improve with AI"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>AI Improve</span>
    </button>
  );
}
