import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAppData } from "../store/AppDataContext";
import { EventItem } from "../types";
import { BackArrowIcon, CalendarIcon, LocationIcon, SeatsIcon } from "../components/Icons";
import { TeacherPanel } from "../components/TeacherPanel";
import { formatEventTime, formatShortDateLabel } from "../utils/format";

export function EventDetailPage() {
  const { id } = useParams();
  const { profile } = useAppData();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [status, setStatus] = useState<string>("");
  const [botHint, setBotHint] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    void api.getEvent(Number(id)).then(setEvent);
  }, [id]);

  const handleRegistration = async () => {
    if (!event || !profile) return;
    try {
      const response = await api.createRegistration({
        telegram_id: profile.telegram_id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        photo_url: profile.photo_url,
        entity_type: "event",
        entity_id: event.id
      });
      setStatus(
        response.message ??
          (response.status === "created" ? "Запись оформлена" : "Ты уже записан")
      );
      setBotHint(response.notification_sent === false ? "https://t.me/tochka_miniapp_bot" : "");
      if (response.status === "created") {
        setEvent((current) =>
          current
            ? { ...current, available_slots: Math.max(0, current.available_slots - 1) }
            : current
        );
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось оформить запись");
      setBotHint("");
    }
  };

  if (!event) {
    return <div className="state-box">Загрузка...</div>;
  }

  return (
    <section className="detail-page">
      <div className="detail-page__title-row">
        <Link className="detail-page__back-link" to="/">
          <span className="detail-page__back-icon">
            <BackArrowIcon width={20} height={20} />
          </span>
        </Link>
        <h1>{event.title}</h1>
      </div>
      <div className="detail-page__hero-panel">
        <div className="detail-page__hero-info">
          <div className="detail-page__hero-row">
            <div className="detail-page__meta-icon">
              <CalendarIcon width={20} height={20} />
            </div>
            <div>
              <span>Дата и время</span>
              <strong>
                {formatShortDateLabel(event.event_datetime)}, {formatEventTime(event.event_datetime)}
              </strong>
            </div>
          </div>
          <div className="detail-page__hero-row">
            <div className="detail-page__meta-icon">
              <LocationIcon width={20} height={20} />
            </div>
            <div>
              <span>Место</span>
              <strong>{event.location}</strong>
            </div>
          </div>
          <div className="detail-page__slots">
            <SeatsIcon width={17} height={17} />
            <span>Осталось {event.available_slots} мест</span>
          </div>
        </div>
        <img className="detail-page__hero-image" src={event.image_url} alt={event.title} />
      </div>
      {event.teacher ? <TeacherPanel teacher={event.teacher} /> : null}
      <div className="detail-page__panel">
        <p>{event.full_description}</p>
      </div>
      <div className="detail-page__cta-bar">
        {status ? <div className="success-note detail-page__success-note">{status}</div> : null}
        {botHint ? (
          <a
            className="bot-link-note detail-page__bot-link-note"
            href={botHint}
            target="_blank"
            rel="noreferrer"
          >
            Открыть бота @tochka_miniapp_bot
          </a>
        ) : null}
        <button
          className="cta-button detail-page__cta-button"
          onClick={handleRegistration}
          type="button"
          disabled={event.available_slots <= 0}
        >
          {event.available_slots > 0 ? "Записаться на мероприятие" : "Свободных мест нет"}
        </button>
      </div>
    </section>
  );
}
