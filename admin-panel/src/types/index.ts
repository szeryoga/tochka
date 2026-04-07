export interface EventItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  event_datetime: string;
  image_url: string;
  is_published: boolean;
}

export interface CourseItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  start_date: string;
  image_url: string;
  is_published: boolean;
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
