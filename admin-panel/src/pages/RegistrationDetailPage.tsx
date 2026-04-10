import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { ContentTable } from "../components/ContentTable";
import { RegistrationDetail } from "../types";

export function RegistrationDetailPage() {
  const { entityType, id } = useParams();
  const [detail, setDetail] = useState<RegistrationDetail | null>(null);

  useEffect(() => {
    if (!id || (entityType !== "events" && entityType !== "courses")) return;

    const request =
      entityType === "events"
        ? api.getEventRegistrationDetail(Number(id))
        : api.getCourseRegistrationDetail(Number(id));

    void request.then(setDetail);
  }, [entityType, id]);

  if (!detail) {
    return <section className="admin-page">Загрузка...</section>;
  }

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <Link className="button-link" to="/registrations">
            Назад к записям
          </Link>
          <h1>{detail.title}</h1>
          <p>Ведущий: {detail.presenter_name}</p>
        </div>
      </div>

      <div className="stats-row">
        <span>Участников: {detail.participants_count}</span>
        <span>Свободно: {detail.free_places}</span>
        <span>Всего мест: {detail.total_places}</span>
      </div>

      {detail.registrations.length > 0 ? (
        <ContentTable
          data={detail.registrations}
          columns={[
            {
              header: "ФИО",
              render: (item) => item.full_name
            },
            {
              header: "Telegram",
              render: (item) => (item.telegram_username ? `@${item.telegram_username}` : "—")
            },
            {
              header: "Дата записи",
              render: (item) => new Date(item.registered_at).toLocaleString("ru-RU")
            }
          ]}
        />
      ) : (
        <div className="empty-state">Пока никто не записался.</div>
      )}
    </section>
  );
}
