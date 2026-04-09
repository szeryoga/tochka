import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const initialState = {
  first_name: "",
  last_name: "",
  short_bio: "",
  full_bio: "",
  photo_url: ""
};

export function TeacherFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!id || id === "new") return;
    void api.getTeacher(Number(id)).then((item) => {
      if (!item) return;
      setForm({
        first_name: item.first_name,
        last_name: item.last_name,
        short_bio: item.short_bio,
        full_bio: item.full_bio,
        photo_url: item.photo_url
      });
    });
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (id && id !== "new") {
      await api.updateTeacher(Number(id), form);
    } else {
      await api.createTeacher(form);
    }
    navigate("/teachers");
  };

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>{id === "new" || !id ? "Новый ведущий" : "Редактирование ведущего"}</h1>
          <p>Форма управления профилем ведущего для mini app и админки.</p>
        </div>
      </div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Имя
          <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
        </label>
        <label>
          Фамилия
          <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
        </label>
        <label>
          Краткая информация
          <textarea
            value={form.short_bio}
            onChange={(e) => setForm({ ...form, short_bio: e.target.value })}
            required
          />
        </label>
        <label>
          Подробная информация
          <textarea
            rows={6}
            value={form.full_bio}
            onChange={(e) => setForm({ ...form, full_bio: e.target.value })}
            required
          />
        </label>
        <label>
          URL фото
          <input
            type="url"
            value={form.photo_url}
            onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            required
          />
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
