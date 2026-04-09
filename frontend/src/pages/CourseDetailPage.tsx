import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAppData } from "../store/AppDataContext";
import { CourseItem } from "../types";
import { GraduationIcon } from "../components/Icons";
import { formatCourseDate } from "../utils/format";

export function CourseDetailPage() {
  const { id } = useParams();
  const { profile } = useAppData();
  const [course, setCourse] = useState<CourseItem | null>(null);
  const [status, setStatus] = useState<string>("");
  const [botHint, setBotHint] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    void api.getCourse(Number(id)).then(setCourse);
  }, [id]);

  const handleRegistration = async () => {
    if (!course || !profile) return;
    const response = await api.createRegistration({
      telegram_id: profile.telegram_id,
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      photo_url: profile.photo_url,
      entity_type: "course",
      entity_id: course.id
    });
    setStatus(
      response.message ??
        (response.status === "created" ? "Запись оформлена" : "Ты уже записан")
    );
    setBotHint(response.notification_sent === false ? "https://t.me/tochka_miniapp_bot" : "");
  };

  if (!course) {
    return <div className="state-box">Загрузка...</div>;
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/courses">
        ← Назад
      </Link>
      <h1>{course.title}</h1>
      <div className="detail-page__panel detail-page__meta">
        <div className="detail-page__meta-icon">
          <GraduationIcon width={20} height={20} />
        </div>
        <div>
          <span>Старт курса</span>
          <strong>{formatCourseDate(course.start_date)}</strong>
        </div>
      </div>
      <img className="detail-page__image" src={course.image_url} alt={course.title} />
      <button className="cta-button" onClick={handleRegistration} type="button">
        Записаться на курс
      </button>
      {status ? <div className="success-note">{status}</div> : null}
      {botHint ? (
        <a className="bot-link-note" href={botHint} target="_blank" rel="noreferrer">
          Открыть бота @tochka_miniapp_bot
        </a>
      ) : null}
      <div className="detail-page__panel">
        <p>{course.full_description}</p>
      </div>
    </section>
  );
}
