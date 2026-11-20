const PageHero = ({
  title,
  subtitle,
  image,
  kicker = "Fernwood",
}) => {
  return (
    <section className="relative overflow-hidden bg-[#031008]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      <div className="absolute inset-0 bg-[#031008]/60" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#D9CDBA]">
            {kicker}
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
