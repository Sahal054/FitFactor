export default function Features({ content }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-brand-dark mb-4 tracking-tight leading-[1.1]">
            {content.title}
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {content.items.map((feature) => (
            <div
              key={feature.num}
              className="group relative bg-white border border-gray-100 p-10 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 text-7xl font-black text-brand-purple/5 select-none transition-colors duration-300 group-hover:text-brand-purple/10">
                {feature.num}
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-purple transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
