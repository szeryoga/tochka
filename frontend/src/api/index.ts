import { apiClient } from "./client";
import {
  CourseItem,
  EventItem,
  Profile,
  RegistrationPayload,
  RegistrationsGrouped,
  Settings
} from "../types";

export const api = {
  getSettings: () => apiClient.get<Settings>("/settings/header"),
  getEvents: () => apiClient.get<EventItem[]>("/events"),
  getEvent: (id: number) => apiClient.get<EventItem>(`/events/${id}`),
  getCourses: () => apiClient.get<CourseItem[]>("/courses"),
  getCourse: (id: number) => apiClient.get<CourseItem>(`/courses/${id}`),
  getRegistrations: (telegramId: number) =>
    apiClient.get<RegistrationsGrouped>(`/me/registrations?telegram_id=${telegramId}`),
  createRegistration: (payload: RegistrationPayload) =>
    apiClient.post<{ status: string; registration_id: number }>("/registrations", payload),
  getTelegramDevProfile: () => apiClient.get<Profile>("/profile/telegram-dev")
};
