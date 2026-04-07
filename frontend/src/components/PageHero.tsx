interface PageHeroProps {
  title: string;
  subtitle: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="page-hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}
