import { NavLink } from "react-router-dom";

const items = [
  { to: "/events", label: "Мероприятия" },
  { to: "/courses", label: "Курсы" },
  { to: "/settings", label: "Настройки" }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">ТОЧКА ADMIN</div>
      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
