interface PageHeroProps {
  title: string;
  subtitle: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="page-hero">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </section>
  );
}
