import { PageHero } from "../components/PageHero";
import { PhoneIcon, UserIcon } from "../components/Icons";
import { useAppData } from "../store/AppDataContext";

export function ProfilePage() {
  const { profile, settings } = useAppData();

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
        <div className="profile-field">
          <UserIcon width={18} height={18} />
          <div>
            <span>Ник в Telegram</span>
            <strong>@{profile?.username ?? "tochka_guest"}</strong>
          </div>
        </div>
        <div className="profile-field">
          <UserIcon width={18} height={18} />
          <div>
            <span>Имя и фамилия</span>
            <strong>
              {profile?.first_name} {profile?.last_name ?? ""}
            </strong>
          </div>
        </div>
        <div className="profile-field">
          <PhoneIcon width={18} height={18} />
          <div>
            <span>Контакты школы</span>
            <strong>{settings?.contact_phone ?? "8 800 201 36 74"}</strong>
          </div>
        </div>
      </section>
    </>
  );
}
