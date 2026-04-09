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

export interface EventItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  event_datetime: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseItem {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  start_date: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  telegram_id: number;
  username?: string | null;
  first_name: string;
  last_name?: string | null;
  photo_url?: string | null;
  notifications: boolean;
}

export interface ProfileUpsertPayload {
  telegram_id: number;
  username?: string | null;
  first_name: string;
  last_name?: string | null;
  photo_url?: string | null;
  notifications?: boolean;
}

export interface RegistrationPayload {
  telegram_id: number;
  username?: string | null;
  first_name: string;
  last_name?: string | null;
  photo_url?: string | null;
  entity_type: "event" | "course";
  entity_id: number;
}

export interface RegistrationItem {
  id: number;
  entity_type: "event" | "course";
  entity_id: number;
  title: string;
  short_description: string;
  date_label: string;
  datetime_value: string;
  created_at: string;
}

export interface RegistrationsGrouped {
  events: RegistrationItem[];
  courses: RegistrationItem[];
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}
