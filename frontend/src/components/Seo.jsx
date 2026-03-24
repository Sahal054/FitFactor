import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'FitFactor';
const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');

export default function Seo({ title, description, path = '/', image = '/android-chrome-512x512.png', noindex = false }) {
  const resolvedTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const resolvedDescription = description || 'FitFactor gym and online training sessions.';
  const canonicalUrl = SITE_URL ? `${SITE_URL}${path}` : '';
  const imageUrl = SITE_URL ? `${SITE_URL}${image}` : '';

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
