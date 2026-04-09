import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAppData } from "../store/AppDataContext";
import { EventItem } from "../types";
import { CalendarIcon } from "../components/Icons";
import { TeacherPanel } from "../components/TeacherPanel";
import { formatEventDate } from "../utils/format";

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
  };

  if (!event) {
    return <div className="state-box">Загрузка...</div>;
  }

  return (
    <section className="detail-page">
      <h1>{event.title}</h1>
      <div className="detail-page__panel detail-page__meta">
        <div className="detail-page__meta-icon">
          <CalendarIcon width={20} height={20} />
        </div>
        <div>
          <span>Дата и время</span>
          <strong>{formatEventDate(event.event_datetime)}</strong>
        </div>
      </div>
      {event.teacher ? <TeacherPanel teacher={event.teacher} /> : null}
      <img className="detail-page__image" src={event.image_url} alt={event.title} />
      <button className="cta-button" onClick={handleRegistration} type="button">
        Записаться на мероприятие
      </button>
      {status ? <div className="success-note">{status}</div> : null}
      {botHint ? (
        <a className="bot-link-note" href={botHint} target="_blank" rel="noreferrer">
          Открыть бота @tochka_miniapp_bot
        </a>
      ) : null}
      <div className="detail-page__panel">
        <p>{event.full_description}</p>
      </div>
    </section>
  );
}
