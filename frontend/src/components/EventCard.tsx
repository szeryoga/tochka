import { Link } from "react-router-dom";
import { EventItem } from "../types";
import { ArrowIcon } from "./Icons";
import { formatDayBadge } from "../utils/format";

interface EventCardProps {
  event: EventItem;
  index: number;
}

const eventPresets = [
  { label: "Лабораторка", tone: "cyan" },
  { label: "Джем", tone: "red" },
  { label: "Мастер-класс", tone: "cyan" }
] as const;

export function EventCard({ event, index }: EventCardProps) {
  const badge = formatDayBadge(event.event_datetime);
  const time = new Date(event.event_datetime).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const preset = eventPresets[index % eventPresets.length];

  return (
    <Link className="content-card content-card--event" to={`/events/${event.id}`}>
      <div className="content-card__media">
        <img className="content-card__image" src={event.image_url} alt={event.title} />
        <div className="content-card__badge">
          <strong>{badge.day}</strong>
          <span>{badge.month}</span>
        </div>
      </div>
      <div className="content-card__body">
        <span className="content-card__meta">{time}</span>
        <h3>{event.title}</h3>
        <p>{event.short_description}</p>
        <div className="content-card__footer">
          <div className={`content-card__pill content-card__pill--${preset.tone}`}>{preset.label}</div>
          <div className={`content-card__action content-card__action--${preset.tone}`}>
            <ArrowIcon width={18} height={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}
