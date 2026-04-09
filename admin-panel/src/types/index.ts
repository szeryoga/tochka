export interface EventItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  event_datetime: string;
  location: string;
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
