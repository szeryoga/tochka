import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const initialState = {
  title: "",
  short_description: "",
  full_description: "",
  start_date: "2026-05-01",
  image_url: "",
  is_published: true
};

export function CourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!id || id === "new") return;
    void api.getCourse(Number(id)).then((item) => {
      if (!item) return;
      setForm({
        title: item.title,
        short_description: item.short_description,
        full_description: item.full_description,
        start_date: item.start_date,
        image_url: item.image_url,
        is_published: item.is_published
      });
    });
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (id && id !== "new") {
      await api.updateCourse(Number(id), form);
    } else {
      await api.createCourse(form);
    }

    navigate("/courses");
  };

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>{id === "new" || !id ? "Новый курс" : "Редактирование курса"}</h1>
          <p>Форма управления курсом, который отображается в mini app.</p>
        </div>
      </div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Название
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          Краткое описание
          <textarea
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            required
          />
        </label>
        <label>
          Полное описание
          <textarea
            rows={6}
            value={form.full_description}
            onChange={(e) => setForm({ ...form, full_description: e.target.value })}
            required
          />
        </label>
        <label>
          Дата старта
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            required
          />
        </label>
        <label>
          URL изображения
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            required
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Опубликовано
        </label>
        <div className="form-actions">
          <button className="button-primary" type="submit">
            Сохранить
          </button>
        </div>
      </form>
    </section>
  );
}
