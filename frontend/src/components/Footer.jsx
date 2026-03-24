import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const socialIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
};

export default function Footer({ siteSettings, footerContent }) {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-16">
          <div>
            <img
              src={siteSettings.brand.logoLightPath}
              alt={siteSettings.brand.logoAlt}
              className="h-12 w-auto mb-6 block"
            />
            <p className="text-gray-400 font-sans text-lg leading-relaxed mb-8">
              {siteSettings.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div className="flex gap-4">
              {siteSettings.socialLinks.map((socialLink) => {
                const Icon = socialIcons[socialLink.platform];
                const isActiveLink = Boolean(socialLink.url);
                const iconClassName = `w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActiveLink
                    ? 'bg-white/5 hover:bg-brand-orange hover:-translate-y-1'
                    : 'bg-white/5 opacity-60'
                }`;

                if (isActiveLink) {
                  return (
                    <a
                      key={socialLink.platform}
                      href={socialLink.url}
                      aria-label={socialLink.label}
                      target="_blank"
                      rel="noreferrer"
                      className={iconClassName}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                }

                return (
                  <span
                    key={socialLink.platform}
                    aria-label={socialLink.label}
                    className={iconClassName}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 text-white tracking-widest uppercase">{footerContent.quickLinksTitle}</h4>
            <ul className="space-y-4 font-sans text-gray-400 text-lg">
              {siteSettings.navigation.map((item) => (
                <li key={item.path}>
                  <button onClick={() => handleNavClick(item.path)} className="hover:text-brand-orange transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 text-white tracking-widest uppercase">{footerContent.hoursTitle}</h4>
            <ul className="space-y-4 font-sans text-gray-400 text-lg">
              {siteSettings.hours.map((hour) =>
                hour.status ? (
                  <li key={hour.label} className="pt-2 text-brand-orange font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                    {hour.value}
                  </li>
                ) : (
                  <li key={hour.label} className="flex justify-between border-b border-gray-800 pb-4">
                    <span>{hour.label}</span>
                    <span className="font-medium text-white">{hour.value}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-gray-500">
          <div>{footerContent.copyrightText}</div>
          <div className="mt-4 md:mt-0 font-medium">
            {footerContent.creditUrl ? (
              <a href={footerContent.creditUrl} className="text-gray-400 hover:text-white transition-colors">
                {footerContent.creditLabel}
              </a>
            ) : (
              <span className="text-gray-400">{footerContent.creditLabel}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
