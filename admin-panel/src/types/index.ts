export interface EventItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  event_datetime: string;
  location: string;
  total_places: number;
  available_slots: number;
  image_url: string;
  teacher_id?: number | null;
  teacher?: Teacher | null;
  is_published: boolean;
}

export interface CourseItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  start_date: string;
  location: string;
  total_places: number;
  available_slots: number;
  image_url: string;
  teacher_id?: number | null;
  teacher?: Teacher | null;
  is_published: boolean;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  short_bio: string;
  full_bio: string;
  photo_url: string;
}

export interface Settings {
  id: number;
  contact_phone: string;
  contact_subtitle: string;
  events_page_title: string;
  events_page_subtitle: string;
  courses_page_title: string;
  courses_page_subtitle: string;
  profile_page_title: string;
  profile_page_subtitle: string;
  my_registrations_page_title: string;
  my_registrations_page_subtitle: string;
  updated_at: string;
}

export interface RegistrationSummary {
  id: number;
  title: string;
  presenter_name: string;
  participants_count: number;
  free_places: number;
  total_places: number;
}

export interface RegisteredUser {
  user_id: number;
  full_name: string;
  telegram_username?: string | null;
  registered_at: string;
}

export interface RegistrationDetail extends RegistrationSummary {
  registrations: RegisteredUser[];
}
