export default function Testimonials({ content }) {
  return (
    <section className="py-32 bg-gray-50 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-brand-dark tracking-tight">
            {content.title}
            <br className="hidden sm:block" />
            <span className="text-brand-purple">{content.highlight}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {content.items.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white p-10 lg:p-14 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative flex flex-col justify-between"
            >
              <div className="absolute top-6 left-8 text-6xl font-sans font-black text-brand-purple/10 pointer-events-none">
                "
              </div>

              <p className="text-lg lg:text-lg font-medium italic text-gray-800 leading-snug mb-10 relative z-10 mt-6">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-5 mt-auto border-t border-gray-100 pt-6">
                <img
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div>
                  <h4 className="font-bold text-lg text-brand-dark">{testimonial.name}</h4>
                  <div className="inline-block mt-1 px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
