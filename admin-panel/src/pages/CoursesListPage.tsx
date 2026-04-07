import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { ContentTable } from "../components/ContentTable";
import { CourseItem } from "../types";

export function CoursesListPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await api.getCourses();
    setCourses(data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>Курсы</h1>
          <p>Управление программами и карточками курсов.</p>
        </div>
        <Link className="button-primary" to="/courses/new">
          Создать
        </Link>
      </div>
      <ContentTable
        data={courses}
        columns={[
          {
            header: "Название",
            render: (item) => (
              <button className="button-link" onClick={() => navigate(`/courses/${item.id}`)} type="button">
                {item.title}
              </button>
            )
          },
          {
            header: "Старт",
            render: (item) => new Date(item.start_date).toLocaleDateString("ru-RU")
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
                  await api.deleteCourse(item.id);
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
