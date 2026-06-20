"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Skill } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function SkillsForm() {
  const { resumeData, addSkill, removeSkill } = useResumeStore();
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Intermediate");

  const handleAdd = () => {
    if (!newSkillName.trim()) return;
    addSkill({
      id: crypto.randomUUID(),
      name: newSkillName.trim(),
      level: newSkillLevel,
    });
    setNewSkillName("");
  };

  const levelColors: Record<string, string> = {
    Beginner: "#f59e0b",
    Intermediate: "#3b82f6",
    Advanced: "#8b5cf6",
    Expert: "#10b981",
  };

  return (
    <div className="animate-fadeIn">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Skills</h3>

      <div className="flex gap-2 mb-4">
        <input type="text"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          } as React.CSSProperties}
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="React, Python, Project Management..."
        />
        <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)}
          className="w-32 px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Expert</option>
        </select>
        <button onClick={handleAdd}
          className="p-2.5 rounded-xl text-white transition-all hover:scale-105 gradient-primary">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resumeData.skills.length === 0 ? (
          <p className="text-sm italic" style={{ color: "var(--text-tertiary)" }}>No skills added yet.</p>
        ) : (
          resumeData.skills.map((skill) => (
            <div key={skill.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg group transition-all"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: levelColors[skill.level] || "#64748b" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{skill.name}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold"
                style={{ color: levelColors[skill.level] || "var(--text-tertiary)" }}>
                {skill.level}
              </span>
              <button onClick={() => removeSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                style={{ color: "var(--text-tertiary)" }}>
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
