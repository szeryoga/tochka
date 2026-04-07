import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { CoursesPage } from "./pages/CoursesPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { EventsPage } from "./pages/EventsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegistrationsPage } from "./pages/RegistrationsPage";
import { AppDataProvider } from "./store/AppDataContext";

export default function App() {
  return (
    <AppDataProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AppDataProvider>
  );
}
