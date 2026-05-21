export default function FlagImage({ country, className = "" }) {
  const src = `/flags/${country.id}.png`;

  return (
    <img
      src={src}
      alt={`${country.name} flag`}
      className={`flag-image ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
