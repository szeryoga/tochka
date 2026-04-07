import { Link } from "react-router-dom";
import { EventItem } from "../types";
import { ArrowIcon } from "./Icons";
import { formatDayBadge } from "../utils/format";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const badge = formatDayBadge(event.event_datetime);
  const time = new Date(event.event_datetime).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <Link className="content-card" to={`/events/${event.id}`}>
      <div className="content-card__badge">
        <strong>{badge.day}</strong>
        <span>{badge.month}</span>
      </div>
      <img className="content-card__image" src={event.image_url} alt={event.title} />
      <div className="content-card__body">
        <span className="content-card__meta">{time}</span>
        <h3>{event.title}</h3>
        <p>{event.short_description}</p>
        <div className="content-card__pill">Лаборатория</div>
      </div>
      <div className="content-card__action">
        <ArrowIcon width={22} height={22} />
      </div>
    </Link>
  );
}
