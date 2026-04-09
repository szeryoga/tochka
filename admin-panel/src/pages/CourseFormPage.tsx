import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { Teacher } from "../types";

const initialState = {
  title: "",
  short_description: "",
  full_description: "",
  start_date: "2026-05-01",
  location: "г. Санкт-Петербург",
  available_slots: 12,
  image_url: "",
  teacher_id: "",
  is_published: true
};

export function CourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    void api.getTeachers().then(setTeachers);
    if (!id || id === "new") return;
    void api.getCourse(Number(id)).then((item) => {
      if (!item) return;
      setForm({
        title: item.title,
        short_description: item.short_description,
        full_description: item.full_description,
        start_date: item.start_date,
        location: item.location,
        available_slots: item.available_slots,
        image_url: item.image_url,
        teacher_id: item.teacher_id ? String(item.teacher_id) : "",
        is_published: item.is_published
      });
    });
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      ...form,
      teacher_id: form.teacher_id ? Number(form.teacher_id) : null
    };

    if (id && id !== "new") {
      await api.updateCourse(Number(id), payload);
    } else {
      await api.createCourse(payload);
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
          Место проведения
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        </label>
        <label>
          Свободных мест
          <input
            type="number"
            min="0"
            value={form.available_slots}
            onChange={(e) => setForm({ ...form, available_slots: Number(e.target.value) })}
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
        <label>
          Ведущий
          <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}>
            <option value="">Не выбран</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.full_name}
              </option>
            ))}
          </select>
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
