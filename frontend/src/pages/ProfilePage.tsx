import { useEffect, useState } from "react";
import { api } from "../api";
import { PageHero } from "../components/PageHero";
import { UserIcon } from "../components/Icons";
import { useAppData } from "../store/AppDataContext";

export function ProfilePage() {
  const { profile, settings, setProfileState } = useAppData();
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (!profile) return;
    setNotifications(profile.notifications);
  }, [profile]);

  const handleNotificationsChange = async (checked: boolean) => {
    if (!profile) return;
    setNotifications(checked);
    const nextProfile = await api.upsertProfile({
      telegram_id: profile.telegram_id,
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      photo_url: profile.photo_url,
      notifications: checked
    });
    setNotifications(nextProfile.notifications);
    setProfileState(nextProfile);
  };

  return (
    <>
      <PageHero
        title={settings?.profile_page_title ?? "Профиль"}
        subtitle={settings?.profile_page_subtitle ?? "Здесь твоя информация и настройки"}
      />
      <section className="profile-card">
        <div className="profile-card__hero">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt={profile.first_name} className="profile-card__avatar" />
          ) : (
            <div className="profile-card__avatar profile-card__avatar--fallback">
              <UserIcon width={36} height={36} />
            </div>
          )}
          <div>
            <h2>
              {profile?.first_name} {profile?.last_name ?? ""}
            </h2>
            <p>@{profile?.username ?? "tochka_guest"}</p>
          </div>
        </div>
        <div className="profile-settings">
          <label className="profile-toggle">
            <span>Получать уведомления о мероприятиях</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => void handleNotificationsChange(event.target.checked)}
            />
            <span className="profile-toggle__slider" />
          </label>
        </div>
      </section>
    </>
  );
}
