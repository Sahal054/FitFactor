export default function CommunityCarousel() {
    const images = [
        { src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80", alt: "Community" },
        { src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", alt: "Training" },
        { src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", alt: "Group" },
        { src: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&q=80", alt: "Classes" },
        { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", alt: "Gym" },
    ];

    const duplicatedImages = [...images, ...images];

    return (
        <section className="py-24 bg-brand-dark overflow-hidden">
            <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16 text-white max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4">
                        The FitFactor Family
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
                        A COMMUNITY LIKE <span className="text-brand-orange">FAMILY</span>
                    </h2>
                    <p className="text-gray-400 font-medium text-lg lg:text-lg mt-4">
                        We train together. We grow together.
                    </p>
                </div>

                {/* Immersive Image Strip */}
                <div className="carousel-wrapper relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-pointer">
                        {duplicatedImages.map((item, index) => (
                            <div key={index} className="px-2">
                                <div className="carousel-card group relative w-[300px] sm:w-[400px] lg:w-[450px] h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={item.src}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        alt={item.alt}
                                    />
                                    {/* Baseline gradient overlay */}
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
