import { NavLink } from "react-router-dom";
import {
  CalendarIcon,
  GraduationIcon,
  TicketIcon,
  UserIcon
} from "./Icons";

const items = [
  { to: "/", label: "Мероприятия", icon: CalendarIcon, end: true },
  { to: "/courses", label: "Курсы", icon: GraduationIcon },
  { to: "/registrations", label: "Мои записи", icon: TicketIcon },
  { to: "/profile", label: "Профиль", icon: UserIcon }
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `bottom-nav__item${isActive ? " is-active" : ""}`}
          aria-label={label}
        >
          <Icon width={24} height={24} />
        </NavLink>
      ))}
    </nav>
  );
}
