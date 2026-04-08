import { useEffect, useState } from "react";
import { api } from "../api";
import { EventCard } from "../components/EventCard";
import { PageHero } from "../components/PageHero";
import { useAppData } from "../store/AppDataContext";
import { EventItem } from "../types";

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { settings } = useAppData();

  useEffect(() => {
    void api
      .getEvents()
      .then((items) => {
        setEvents(items);
        setHasError(false);
        setErrorMessage("");
      })
      .catch((error: unknown) => {
        setEvents([]);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="events-page">
      <PageHero
        title={settings?.events_page_title ?? "Мероприятия"}
        subtitle={settings?.events_page_subtitle ?? "Выбери событие и стань частью момента"}
      />
      {hasError ? (
        <div className="state-box">
          Не удалось загрузить мероприятия.
          {errorMessage ? ` (${errorMessage})` : ""}
        </div>
      ) : isLoading ? (
        <div className="state-box">Загрузка...</div>
      ) : events.length === 0 ? (
        <div className="state-box">Пока нет опубликованных мероприятий.</div>
      ) : (
        <section className="stack-list">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </section>
      )}
    </section>
  );
}
