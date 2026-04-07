import { useEffect, useState } from "react";
import { api } from "../api";
import { EventCard } from "../components/EventCard";
import { PageHero } from "../components/PageHero";
import { useAppData } from "../store/AppDataContext";
import { EventItem } from "../types";

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const { settings } = useAppData();

  useEffect(() => {
    void api.getEvents().then(setEvents);
  }, []);

  return (
    <section className="events-page">
      <PageHero
        title={settings?.events_page_title ?? "Мероприятия"}
        subtitle={settings?.events_page_subtitle ?? "Выбери событие и стань частью момента"}
      />
      <section className="stack-list">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </section>
    </section>
  );
}
