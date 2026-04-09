import { CourseItem, EventItem, Settings, Teacher } from "../types";
import { apiClient } from "./client";

export const api = {
  getEvents: () => apiClient.get<EventItem[]>("/admin/events"),
  getEvent: async (id: number) => {
    const events = await apiClient.get<EventItem[]>("/admin/events");
    return events.find((item) => item.id === id) ?? null;
  },
  createEvent: (payload: Omit<EventItem, "id">) => apiClient.post<EventItem>("/admin/events", payload),
  updateEvent: (id: number, payload: Omit<EventItem, "id">) =>
    apiClient.put<EventItem>(`/admin/events/${id}`, payload),
  deleteEvent: (id: number) => apiClient.delete(`/admin/events/${id}`),
  getCourses: () => apiClient.get<CourseItem[]>("/admin/courses"),
  getCourse: async (id: number) => {
    const courses = await apiClient.get<CourseItem[]>("/admin/courses");
    return courses.find((item) => item.id === id) ?? null;
  },
  createCourse: (payload: Omit<CourseItem, "id">) =>
    apiClient.post<CourseItem>("/admin/courses", payload),
  updateCourse: (id: number, payload: Omit<CourseItem, "id">) =>
    apiClient.put<CourseItem>(`/admin/courses/${id}`, payload),
  deleteCourse: (id: number) => apiClient.delete(`/admin/courses/${id}`),
  getTeachers: () => apiClient.get<Teacher[]>("/admin/teachers"),
  getTeacher: async (id: number) => {
    const teachers = await apiClient.get<Teacher[]>("/admin/teachers");
    return teachers.find((item) => item.id === id) ?? null;
  },
  createTeacher: (payload: Omit<Teacher, "id" | "full_name">) =>
    apiClient.post<Teacher>("/admin/teachers", payload),
  updateTeacher: (id: number, payload: Omit<Teacher, "id" | "full_name">) =>
    apiClient.put<Teacher>(`/admin/teachers/${id}`, payload),
  deleteTeacher: (id: number) => apiClient.delete(`/admin/teachers/${id}`),
  getSettings: () => apiClient.get<Settings>("/admin/settings"),
  updateSettings: (payload: Omit<Settings, "id" | "updated_at">) =>
    apiClient.put<Settings>("/admin/settings", payload)
};
