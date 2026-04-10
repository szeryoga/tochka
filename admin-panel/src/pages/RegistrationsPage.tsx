import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { ContentTable } from "../components/ContentTable";
import { RegistrationSummary } from "../types";

function SummaryTable({
  data,
  entityType
}: {
  data: RegistrationSummary[];
  entityType: "events" | "courses";
}) {
  const navigate = useNavigate();

  return (
    <ContentTable
      data={data}
      columns={[
        {
          header: entityType === "events" ? "Мероприятие" : "Курс",
          render: (item) => (
            <button
              className="button-link"
              onClick={() => navigate(`/registrations/${entityType}/${item.id}`)}
              type="button"
            >
              {item.title}
            </button>
          )
        },
        {
          header: "Ведущий",
          render: (item) => item.presenter_name
        },
        {
          header: "Участников",
          render: (item) => item.participants_count
        },
        {
          header: "Свободно",
          render: (item) => item.free_places
        },
        {
          header: "Всего мест",
          render: (item) => item.total_places
        }
      ]}
    />
  );
}

export function RegistrationsPage() {
  const [events, setEvents] = useState<RegistrationSummary[]>([]);
  const [courses, setCourses] = useState<RegistrationSummary[]>([]);

  useEffect(() => {
    void Promise.all([
      api.getEventRegistrationSummary(),
      api.getCourseRegistrationSummary()
    ]).then(([eventsData, coursesData]) => {
      setEvents(eventsData);
      setCourses(coursesData);
    });
  }, []);

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>Записи</h1>
          <p>Сводка по участникам мероприятий и курсов.</p>
        </div>
      </div>

      <section className="admin-section">
        <div className="admin-section__head">
          <h2>Мероприятия</h2>
        </div>
        <SummaryTable data={events} entityType="events" />
      </section>

      <section className="admin-section">
        <div className="admin-section__head">
          <h2>Курсы</h2>
        </div>
        <SummaryTable data={courses} entityType="courses" />
      </section>
    </section>
  );
}
