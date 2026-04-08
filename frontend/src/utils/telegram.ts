import { api } from "../api";
import { Profile, TelegramUser } from "../types";

const DEV_FALLBACK_PROFILE: Profile = {
  telegram_id: 777000123,
  username: "tochka_guest",
  first_name: "Гость",
  last_name: "Точки",
  photo_url: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80",
  notifications: true
};

export async function getTelegramProfile(): Promise<Profile> {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user as TelegramUser | undefined;

  if (webApp) {
    webApp.ready();
    webApp.expand();
  }

  if (user) {
    return {
      telegram_id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      photo_url: user.photo_url,
      notifications: true
    };
  }

  try {
    return await api.getTelegramDevProfile();
  } catch {
    return DEV_FALLBACK_PROFILE;
  }
}
