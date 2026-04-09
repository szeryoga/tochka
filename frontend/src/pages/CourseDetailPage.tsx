import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAppData } from "../store/AppDataContext";
import { CourseItem } from "../types";
import { BackArrowIcon, CalendarIcon, LocationIcon, SeatsIcon } from "../components/Icons";
import { TeacherPanel } from "../components/TeacherPanel";
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
    try {
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
      if (response.status === "created") {
        setCourse((current) =>
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

  if (!course) {
    return <div className="state-box">Загрузка...</div>;
  }

  return (
    <section className="detail-page">
      <div className="detail-page__title-row">
        <Link className="detail-page__back-link" to="/courses">
          <span className="detail-page__back-icon">
            <BackArrowIcon width={20} height={20} />
          </span>
        </Link>
        <h1>{course.title}</h1>
      </div>
      <div className="detail-page__hero-panel">
        <div className="detail-page__hero-info">
          <div className="detail-page__hero-row">
            <div className="detail-page__meta-icon">
              <CalendarIcon width={20} height={20} />
            </div>
            <div>
              <span>Дата старта</span>
              <strong>{formatCourseDate(course.start_date)}</strong>
            </div>
          </div>
          <div className="detail-page__hero-row">
            <div className="detail-page__meta-icon">
              <LocationIcon width={20} height={20} />
            </div>
            <div>
              <span>Место</span>
              <strong>{course.location}</strong>
            </div>
          </div>
          <div className="detail-page__slots">
            <SeatsIcon width={17} height={17} />
            <span>Осталось {course.available_slots} мест</span>
          </div>
        </div>
        <img className="detail-page__hero-image" src={course.image_url} alt={course.title} />
      </div>
      {course.teacher ? <TeacherPanel teacher={course.teacher} /> : null}
      <div className="detail-page__panel">
        <p>{course.full_description}</p>
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
          disabled={course.available_slots <= 0}
        >
          {course.available_slots > 0 ? "Записаться на курс" : "Свободных мест нет"}
        </button>
      </div>
    </section>
  );
}
