import { api } from "../api";
import { Profile, TelegramUser } from "../types";

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

  return api.getTelegramDevProfile();
}
