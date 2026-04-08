import { SVGProps } from "react";

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      {props.children}
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M7 3.5v4M17 3.5v4M3.5 9.5h17" />
    </IconBase>
  );
}

export function GraduationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
      <path d="M6.5 11.5V15c0 1.1 2.2 3 5.5 3s5.5-1.9 5.5-3v-3.5" />
    </IconBase>
  );
}

export function TicketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M6 7.5h12a2 2 0 0 1 2 2c-1.1 0-2 .9-2 2s.9 2 2 2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2c1.1 0 2-.9 2-2s-.9-2-2-2a2 2 0 0 1 2-2Z" />
      <path d="M12 7.5v9" strokeDasharray="2 2" />
    </IconBase>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 12a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M6 12h12" />
      <path d="m13 7 5 5-5 5" />
    </IconBase>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M8.2 4.8c.4-.9 1.4-1.3 2.3-.9l1.6.7c.8.4 1.2 1.3 1 2.2l-.5 2c-.1.5 0 1 .4 1.4l1.7 1.7c.4.4.9.5 1.4.4l2-.5c.9-.2 1.8.2 2.2 1l.7 1.6c.4.9 0 1.9-.9 2.3l-1.5.7c-1.2.5-2.6.6-3.9.2-4.8-1.5-8.6-5.3-10.1-10.1-.4-1.3-.3-2.7.2-3.9l.7-1.5Z" />
    </IconBase>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M9 4.5h6l.7 1.5H19" />
      <path d="M6 6h12" />
      <path d="M8 6l.7 12a2 2 0 0 0 2 1.8h2.6a2 2 0 0 0 2-1.8L16 6" />
    </IconBase>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10v5" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
