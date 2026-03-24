export function scrollToSection(sectionId, extraOffset = 16) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const targetElement = document.getElementById(sectionId);

  if (!targetElement) {
    return false;
  }

  const navbarOffset = document.getElementById('navbar')?.offsetHeight ?? 80;
  const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - navbarOffset - extraOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: 'smooth',
  });

  return true;
}
