import { ArrowIcon, CalendarIcon, GraduationIcon } from "./Icons";
import { RegistrationItem } from "../types";

interface RegistrationCardProps {
  item: RegistrationItem;
  onCancel: (item: RegistrationItem) => void;
}

export function RegistrationCard({ item, onCancel }: RegistrationCardProps) {
  const isEvent = item.entity_type === "event";

  return (
    <div className="registration-card">
      <div className={`registration-card__date ${isEvent ? "is-event" : "is-course"}`}>
        {isEvent ? <CalendarIcon width={18} height={18} /> : <GraduationIcon width={18} height={18} />}
      </div>
      <div className="registration-card__content">
        <span className="registration-card__meta">{item.date_label}</span>
        <h3>{item.title}</h3>
        <p>{item.short_description}</p>
      </div>
      <div className="registration-card__status">
        <span>{isEvent ? "Записан" : "Активен"}</span>
        <button className="registration-card__cancel" onClick={() => onCancel(item)} type="button">
          Отменить
        </button>
      </div>
    </div>
  );
}
