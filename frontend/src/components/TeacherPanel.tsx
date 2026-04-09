import { useState } from "react";
import { Teacher } from "../types";

interface TeacherPanelProps {
  teacher: Teacher;
}

export function TeacherPanel({ teacher }: TeacherPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      className={`detail-page__panel detail-page__meta teacher-panel${expanded ? " is-expanded" : ""}`}
      onClick={() => setExpanded((value) => !value)}
      type="button"
    >
      <div className="teacher-panel__avatar-wrap">
        <img className="teacher-panel__avatar" src={teacher.photo_url} alt={teacher.full_name} />
      </div>
      <div className="teacher-panel__content">
        <span>Ведущий</span>
        <strong>{teacher.full_name}</strong>
        <span className="teacher-panel__short">{teacher.short_bio}</span>
        {expanded ? <span className="teacher-panel__full">{teacher.full_bio}</span> : null}
      </div>
      <span className={`teacher-panel__chevron${expanded ? " is-expanded" : ""}`}>⌄</span>
    </button>
  );
}
