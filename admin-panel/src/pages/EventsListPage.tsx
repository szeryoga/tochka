import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { ContentTable } from "../components/ContentTable";
import { EventItem } from "../types";

export function EventsListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await api.getEvents();
    setEvents(data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>Мероприятия</h1>
          <p>Управление событиями mini app.</p>
        </div>
        <Link className="button-primary" to="/events/new">
          Создать
        </Link>
      </div>
      <ContentTable
        data={events}
        columns={[
          {
            header: "Название",
            render: (item) => (
              <button className="button-link" onClick={() => navigate(`/events/${item.id}`)} type="button">
                {item.title}
              </button>
            )
          },
          {
            header: "Дата",
            render: (item) => new Date(item.event_datetime).toLocaleString("ru-RU")
          },
          {
            header: "Статус",
            render: (item) => (item.is_published ? "Опубликовано" : "Черновик")
          },
          {
            header: "Удалить",
            render: (item) => (
              <button
                className="button-danger"
                onClick={async () => {
                  await api.deleteEvent(item.id);
                  await load();
                }}
                type="button"
              >
                Удалить
              </button>
            )
          }
        ]}
      />
    </section>
  );
}
