import { FormEvent, useEffect, useState } from "react";
import { api } from "../api";
import { Settings } from "../types";

const initialState: Omit<Settings, "id" | "updated_at"> = {
  contact_phone: "",
  contact_subtitle: "",
  events_page_title: "",
  events_page_subtitle: "",
  courses_page_title: "",
  courses_page_subtitle: "",
  profile_page_title: "",
  profile_page_subtitle: "",
  my_registrations_page_title: "",
  my_registrations_page_subtitle: ""
};

export function SettingsPage() {
  const [form, setForm] = useState(initialState);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    void api.getSettings().then((settings) => {
      setForm({
        contact_phone: settings.contact_phone,
        contact_subtitle: settings.contact_subtitle,
        events_page_title: settings.events_page_title,
        events_page_subtitle: settings.events_page_subtitle,
        courses_page_title: settings.courses_page_title,
        courses_page_subtitle: settings.courses_page_subtitle,
        profile_page_title: settings.profile_page_title,
        profile_page_subtitle: settings.profile_page_subtitle,
        my_registrations_page_title: settings.my_registrations_page_title,
        my_registrations_page_subtitle: settings.my_registrations_page_subtitle
      });
      setSavedAt(settings.updated_at);
    });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await api.updateSettings(form);
    setSavedAt(response.updated_at);
  };

  return (
    <section className="admin-page">
      <div className="page-head">
        <div>
          <h1>Настройки</h1>
          <p>Контакты в шапке и тексты основных экранов mini app.</p>
        </div>
        {savedAt ? <span className="saved-badge">Обновлено {new Date(savedAt).toLocaleString("ru-RU")}</span> : null}
      </div>
      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Телефон
          <input
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            required
          />
        </label>
        <label>
          Подпись под телефоном
          <input
            value={form.contact_subtitle}
            onChange={(e) => setForm({ ...form, contact_subtitle: e.target.value })}
            required
          />
        </label>
        <label>
          Заголовок страницы мероприятий
          <input
            value={form.events_page_title}
            onChange={(e) => setForm({ ...form, events_page_title: e.target.value })}
            required
          />
        </label>
        <label>
          Подзаголовок страницы мероприятий
          <textarea
            value={form.events_page_subtitle}
            onChange={(e) => setForm({ ...form, events_page_subtitle: e.target.value })}
            required
          />
        </label>
        <label>
          Заголовок страницы курсов
          <input
            value={form.courses_page_title}
            onChange={(e) => setForm({ ...form, courses_page_title: e.target.value })}
            required
          />
        </label>
        <label>
          Подзаголовок страницы курсов
          <textarea
            value={form.courses_page_subtitle}
            onChange={(e) => setForm({ ...form, courses_page_subtitle: e.target.value })}
            required
          />
        </label>
        <label>
          Заголовок страницы профиля
          <input
            value={form.profile_page_title}
            onChange={(e) => setForm({ ...form, profile_page_title: e.target.value })}
            required
          />
        </label>
        <label>
          Подзаголовок страницы профиля
          <textarea
            value={form.profile_page_subtitle}
            onChange={(e) => setForm({ ...form, profile_page_subtitle: e.target.value })}
            required
          />
        </label>
        <label>
          Заголовок страницы записей
          <input
            value={form.my_registrations_page_title}
            onChange={(e) => setForm({ ...form, my_registrations_page_title: e.target.value })}
            required
          />
        </label>
        <label>
          Подзаголовок страницы записей
          <textarea
            value={form.my_registrations_page_subtitle}
            onChange={(e) => setForm({ ...form, my_registrations_page_subtitle: e.target.value })}
            required
          />
        </label>
        <div className="form-actions">
          <button className="button-primary" type="submit">
            Сохранить настройки
          </button>
        </div>
      </form>
    </section>
  );
}
