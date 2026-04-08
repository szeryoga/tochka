import { useEffect, useState } from "react";
import { api } from "../api";
import { RegistrationCard } from "../components/RegistrationCard";
import { CloseIcon, InfoIcon, TrashIcon } from "../components/Icons";
import { PageHero } from "../components/PageHero";
import { useAppData } from "../store/AppDataContext";
import { RegistrationItem, RegistrationsGrouped } from "../types";

export function RegistrationsPage() {
  const { profile, settings } = useAppData();
  const [data, setData] = useState<RegistrationsGrouped>({ events: [], courses: [] });
  const [pendingCancel, setPendingCancel] = useState<RegistrationItem | null>(null);

  const loadRegistrations = async () => {
    if (!profile) return;
    const nextData = await api.getRegistrations(profile.telegram_id);
    setData(nextData);
  };

  useEffect(() => {
    if (!profile) return;
    void loadRegistrations();
  }, [profile]);

  const handleCancel = async (item: RegistrationsGrouped["events"][number]) => {
    setPendingCancel(item);
  };

  const confirmCancel = async () => {
    if (!profile || !pendingCancel) return;
    await api.deleteRegistration({
      telegram_id: profile.telegram_id,
      entity_type: pendingCancel.entity_type,
      entity_id: pendingCancel.entity_id
    });
    setPendingCancel(null);
    await loadRegistrations();
  };

  return (
    <>
      <PageHero
        title={settings?.my_registrations_page_title ?? "Мои записи"}
        subtitle={settings?.my_registrations_page_subtitle ?? "Здесь все, на что ты записан"}
      />
      <section className="registrations-section">
        <div className="section-title registrations-section__title">
          <h2>Мои мероприятия</h2>
        </div>
        <div className="stack-list">
          {data.events.length ? (
            data.events.map((item) => <RegistrationCard key={item.id} item={item} onCancel={handleCancel} />)
          ) : (
            <div className="state-box">Пока нет записей на мероприятия.</div>
          )}
        </div>
      </section>
      <section className="registrations-section">
        <div className="section-title registrations-section__title">
          <h2>Мои курсы</h2>
        </div>
        <div className="stack-list">
          {data.courses.length ? (
            data.courses.map((item) => <RegistrationCard key={item.id} item={item} onCancel={handleCancel} />)
          ) : (
            <div className="state-box">Пока нет записей на курсы.</div>
          )}
        </div>
      </section>
      {pendingCancel ? (
        <div className="cancel-modal">
          <div className="cancel-modal__backdrop" onClick={() => setPendingCancel(null)} />
          <div className="cancel-modal__card">
            <button className="cancel-modal__close" onClick={() => setPendingCancel(null)} type="button">
              <CloseIcon width={18} height={18} />
            </button>
            <div className="cancel-modal__icon">
              <TrashIcon width={34} height={34} />
            </div>
            <h3>Отменить запись?</h3>
            <p className="cancel-modal__subtitle">
              Ты записан на {pendingCancel.entity_type === "event" ? "мероприятие" : "курс"}
            </p>
            <p className="cancel-modal__title">«{pendingCancel.title}»</p>
            <p className="cancel-modal__date">{pendingCancel.date_label}</p>
            <div className="cancel-modal__info">
              <InfoIcon width={18} height={18} />
              <span>Место освободится, и его сможет занять другой участник.</span>
            </div>
            <button className="cancel-modal__confirm" onClick={() => void confirmCancel()} type="button">
              <TrashIcon width={16} height={16} />
              Да, отменить запись
            </button>
            <button className="cancel-modal__keep" onClick={() => setPendingCancel(null)} type="button">
              Оставить запись
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
