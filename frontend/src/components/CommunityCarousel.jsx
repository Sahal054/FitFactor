export default function CommunityCarousel({ content }) {
  const duplicatedImages = [...content.images, ...content.images];

  return (
    <section className="py-24 bg-brand-dark overflow-hidden">
      <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 text-white max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4">
            {content.badge}
          </span>
          <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
            {content.title} <span className="text-brand-orange">{content.highlight}</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg lg:text-lg mt-4">{content.description}</p>
        </div>

        <div className="carousel-wrapper relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {duplicatedImages.map((item, index) => (
              <div key={`${item.src}-${index}`} className="px-2">
                <div className="carousel-card group relative w-[300px] sm:w-[400px] lg:w-[450px] h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={item.src}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    alt={item.alt}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
