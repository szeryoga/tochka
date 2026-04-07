import { useEffect, useState } from "react";
import { api } from "../api";
import { RegistrationCard } from "../components/RegistrationCard";
import { PageHero } from "../components/PageHero";
import { useAppData } from "../store/AppDataContext";
import { RegistrationsGrouped } from "../types";

export function RegistrationsPage() {
  const { profile, settings } = useAppData();
  const [data, setData] = useState<RegistrationsGrouped>({ events: [], courses: [] });

  useEffect(() => {
    if (!profile) return;
    void api.getRegistrations(profile.telegram_id).then(setData);
  }, [profile]);

  return (
    <>
      <PageHero
        title={settings?.my_registrations_page_title ?? "Мои записи"}
        subtitle={settings?.my_registrations_page_subtitle ?? "Здесь все, на что ты записан"}
      />
      <section className="registrations-section">
        <div className="section-title registrations-section__title">
          <h2>Мои мероприятия</h2>
          <span>{data.events.length} записи</span>
        </div>
        <div className="stack-list">
          {data.events.length ? (
            data.events.map((item) => <RegistrationCard key={item.id} item={item} />)
          ) : (
            <div className="state-box">Пока нет записей на мероприятия.</div>
          )}
        </div>
      </section>
      <section className="registrations-section">
        <div className="section-title registrations-section__title">
          <h2>Мои курсы</h2>
          <span>{data.courses.length} курса</span>
        </div>
        <div className="stack-list">
          {data.courses.length ? (
            data.courses.map((item) => <RegistrationCard key={item.id} item={item} />)
          ) : (
            <div className="state-box">Пока нет записей на курсы.</div>
          )}
        </div>
      </section>
    </>
  );
}
