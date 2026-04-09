import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { ContentTable } from "../components/ContentTable";
import { Teacher } from "../types";

export function TeachersListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await api.getTeachers();
    setTeachers(data);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>Ведущие</h1>
          <p>Управление преподавателями и ведущими мероприятий и курсов.</p>
        </div>
        <Link className="button-primary" to="/teachers/new">
          Создать
        </Link>
      </div>
      <ContentTable
        data={teachers}
        columns={[
          {
            header: "Фото",
            render: (item) => <img className="table-avatar" src={item.photo_url} alt={item.full_name} />
          },
          {
            header: "Имя",
            render: (item) => (
              <button className="button-link" onClick={() => navigate(`/teachers/${item.id}`)} type="button">
                {item.first_name}
              </button>
            )
          },
          { header: "Фамилия", render: (item) => item.last_name },
          { header: "Кратко", render: (item) => item.short_bio },
          {
            header: "Удалить",
            render: (item) => (
              <button
                className="button-danger"
                onClick={async () => {
                  await api.deleteTeacher(item.id);
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
