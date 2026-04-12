export function SectionTitle({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight text-content-neutral-primary"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-content-neutral-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
