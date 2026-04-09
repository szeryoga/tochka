import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { CourseFormPage } from "./pages/CourseFormPage";
import { CoursesListPage } from "./pages/CoursesListPage";
import { EventFormPage } from "./pages/EventFormPage";
import { EventsListPage } from "./pages/EventsListPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TeacherFormPage } from "./pages/TeacherFormPage";
import { TeachersListPage } from "./pages/TeachersListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventFormPage />} />
        <Route path="/courses" element={<CoursesListPage />} />
        <Route path="/courses/:id" element={<CourseFormPage />} />
        <Route path="/teachers" element={<TeachersListPage />} />
        <Route path="/teachers/:id" element={<TeacherFormPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
