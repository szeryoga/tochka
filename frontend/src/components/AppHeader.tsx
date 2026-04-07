import { useAppData } from "../store/AppDataContext";

export function AppHeader() {
  const { settings } = useAppData();

  return (
    <header className="app-header">
      <img className="app-logo" src="/logo.png" alt="Точка" />
      <div className="app-header__contacts">
        <div className="app-header__phone">{settings?.contact_phone ?? "8 800 201 36 74"}</div>
        <div className="app-header__subtitle">{settings?.contact_subtitle ?? "г. Санкт-Петербург"}</div>
      </div>
    </header>
  );
}
