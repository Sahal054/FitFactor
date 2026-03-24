const navigation = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Pricing & Plans', path: '/pricing' },
  { label: 'Daily Live Session', path: '/#daily-live-section' },
  { label: 'Contact', path: '/contact' },
];

const consultationGoals = [
  { value: 'Weight Loss', label: 'Weight Loss' },
  { value: 'Muscle Gain', label: 'Muscle Gain' },
  { value: 'General Fitness', label: 'General Fitness' },
  { value: 'Online Coaching', label: 'Online Coaching' },
];

export const mockAppShellData = {
  siteSettings: {
    brand: {
      initial: 'F',
      namePrefix: 'FIT',
      nameAccent: 'FACTOR',
      logoAlt: 'FitFactor logo',
      logoMarkPath: '/fitfactor-mark.svg',
      logoDarkPath: '/fitfactor-logo-dark.svg',
      logoLightPath: '/fitfactor-logo-light.svg',
    },
    navigation,
    contact: {
      addressLines: ['123 Gym Street, Chinnakada', 'Kollam, Kerala 691001'],
      phone: '+91 98765 43210',
      whatsappUrl: 'https://wa.me/919876543210',
    },
    hours: [
      { label: 'Mon - Sun', value: '5:00 AM - 11:00 PM' },
      { label: 'Status', value: 'Open All Days', status: true },
    ],
    socialLinks: [
      { platform: 'instagram', label: 'Instagram', url: '' },
      { platform: 'youtube', label: 'YouTube', url: '' },
      { platform: 'facebook', label: 'Facebook', url: '' },
    ],
    consultationGoals,
  },
  globalContent: {
    navbar: {
      primaryCta: {
        label: 'Book Consultation',
        path: '/contact',
      },
    },
    footer: {
      quickLinksTitle: 'Quick Links',
      hoursTitle: 'Hours',
      copyrightText: 'Copyright 2026 FitFactor. All Rights Reserved.',
      creditLabel: 'Crafted with passion by Wahn Design',
      creditUrl: '',
    },
    offerPopup: {
      enabled: true,
      delayMs: 3000,
      title: 'Flash Sale!',
      description: 'Get 50% OFF your first month of Online Coaching.',
      promoCode: 'FIT50NOW',
      ctaLabel: 'Claim Offer',
      ctaPath: '/pricing',
      disclaimer: 'Valid for new members only. Ends in 24 hours.',
    },
  },
};

export const mockHomePageData = {
  hero: {
    eyebrow: 'Fitness For',
    title: 'Every Body.',
    accentTitle: 'Every Age.',
    description:
      'Strength training, fat loss, and real accountability - built for busy professionals in Kollam.',
    primaryCtaLabel: 'Join on WhatsApp',
    secondaryCta: {
      label: 'Free Consultation',
      path: '/contact',
    },
    image: {
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
      alt: 'Gym interior',
    },
  },
  onlineCoaching: {
    badge: 'Global Access',
    titleTop: 'Online',
    titleBottom: 'Transformation.',
    description:
      'Expert guidance, custom nutrition, and real accountability - anywhere in the world.',
    image: {
      src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
      alt: 'Online coaching',
    },
    benefits: [
      {
        iconKey: 'smartphone',
        title: 'Custom App Access',
        description: 'Your daily workouts, tracked seamlessly.',
      },
      {
        iconKey: 'utensils',
        title: 'Macro-based Nutrition',
        description: 'Eat what you love, structured for results.',
      },
      {
        iconKey: 'video',
        title: 'Weekly Video Check-ins',
        description: 'Face-to-face feedback to keep you pushing.',
      },
    ],
    cta: {
      label: 'Start Your Transformation',
      path: '/contact',
    },
  },
  dailyLiveWorkouts: {
    badge: 'Virtual Fitness',
    titleTop: 'Daily Live',
    titleBottom: 'Workout Sessions',
    description: 'Train live. Get corrected in real time. Stay accountable.',
    video: {
      poster: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1920&q=80',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    benefits: [
      {
        iconKey: 'edit',
        title: 'Live Corrections',
        description: 'Real-time form checks to prevent injury.',
      },
      {
        iconKey: 'users',
        title: 'Community Support',
        description: 'Sweat alongside members everywhere.',
      },
      {
        iconKey: 'book',
        title: 'Structured Programs',
        description: 'Follow a specialized daily routine.',
      },
    ],
    cta: {
      label: 'Open Daily Live Session',
      path: '/daily-live-session',
    },
  },
  features: {
    title: 'The Most Trusted Gym in Kollam',
    subtitle: 'Built for results. Backed by science.',
    items: [
      {
        num: '01',
        title: 'FREE InBody',
        desc: 'Track your progress with scientific accuracy. Body composition analysis included.',
      },
      {
        num: '02',
        title: 'FREE Steam Bath',
        desc: 'Premium recovery at no extra cost. Relax your muscles after a hard session.',
      },
      {
        num: '03',
        title: 'Open All Days',
        desc: 'Consistency without compromise. We are open 7 days a week for your grind.',
      },
      {
        num: '04',
        title: 'Freeze Anytime',
        desc: "Going out of town? Pause your plan when life happens so you don't lose days.",
      },
      {
        num: '05',
        title: 'All-Day Hours',
        desc: 'Train when your schedule allows. Early morning to late night access.',
      },
      {
        num: '06',
        title: 'Multiple Disciplines',
        desc: 'Strength, boxing, animal flow, and more under one roof.',
      },
    ],
  },
  testimonials: {
    title: 'Real People.',
    highlight: 'Real Transformations.',
    items: [
      {
        quote:
          "Lost 15kg and gained a new life. The coaches at FitFactor gave me the confidence to follow through. I've never felt stronger or more supported in my life.",
        name: 'Arjun R.',
        result: 'Lost 15kg',
        image: {
          src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=250&q=80',
          alt: 'Arjun R.',
        },
      },
      {
        quote:
          "From zero confidence to loving the gym. As a complete beginner, I was intimidated. The community here is so welcoming. Now it's the best part of my day.",
        name: 'Meera S.',
        result: 'Confidence Gained',
        image: {
          src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=250&q=80',
          alt: 'Meera S.',
        },
      },
    ],
  },
  communityCarousel: {
    badge: 'The FitFactor Family',
    title: 'A Community Like',
    highlight: 'Family',
    description: 'We train together. We grow together.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
        alt: 'Community workout',
      },
      {
        src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
        alt: 'Personal training session',
      },
      {
        src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
        alt: 'Group training class',
      },
      {
        src: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&q=80',
        alt: 'Workout class',
      },
      {
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        alt: 'Gym floor',
      },
    ],
  },
  consultationSection: {
    title: 'Start Your',
    highlight: 'Journey',
    suffix: 'Today',
    description:
      "Not sure where to begin? Book a free consultation. We'll assess your fitness level and create a roadmap for your goals.",
    submitLabel: 'Claim Your Free Consultation',
    submitNote: 'No spam. No obligation. Just a quick call to see how we can help.',
    successTitle: 'Request Sent',
    successMessage:
      'Thank you! A FitFactor coach will reach out soon to help you take the next step.',
    successResetLabel: 'Send Another Request',
    trustIndicators: [
      { iconKey: 'calendar', label: 'Open 7 Days' },
      { iconKey: 'users', label: '1000+ Members' },
      { iconKey: 'award', label: 'Certified Pros' },
    ],
  },
};

export const mockAboutPageData = {
  header: {
    title: 'Who We Are',
    subtitle: 'More than a gym. A results-driven community in Kollam.',
  },
  headline: {
    prefix: 'A Gym Built on',
    highlight: 'Community',
    suffix: ', Care, and Real Progress.',
  },
  sections: [
    {
      title: 'Who We Serve',
      body:
        'FitFactor is designed for real people - beginners, families, seniors, professionals, and students. Anyone who wants fitness to feel achievable, safe, and motivating.',
    },
    {
      title: 'What Makes Us Different',
      body:
        'We combine expertise with empathy, discipline with warmth, and premium equipment with a highly inclusive atmosphere.',
    },
    {
      title: 'What You Can Expect',
      body:
        'We are not just a place to workout; we are a place to belong. Expect pristine facilities, structured guidance, and a supportive team pushing you forward.',
    },
  ],
  stats: [
    { iconKey: 'users', label: '1000+ Members' },
    { iconKey: 'award', label: 'Certified Trainers' },
    { iconKey: 'calendar', label: 'Open 7 Days a Week' },
  ],
  cta: {
    label: 'Join Our Family',
    path: '/contact',
  },
  image: {
    src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1000&q=80',
    alt: 'About FitFactor community',
  },
};

export const mockPricingPageData = {
  header: {
    title: 'Membership Plans',
    subtitle: 'Simple Plans. Complete Clarity.',
    badge: 'No hidden fees. No long-term pressure. Cancel anytime.',
  },
  plans: [
    {
      id: 'monthly',
      name: 'Monthly',
      description: 'No commitment. Pause anytime.',
      price: '3,000',
      currency: 'Rs.',
      monthlyEquivalent: null,
      savings: null,
      features: ['Full Gym Access', 'Free InBody Scan', 'Free Steam Bath'],
      featured: false,
      ctaLabel: 'Get Started',
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      description: '3-month plan. Best balance.',
      price: '7,500',
      currency: 'Rs.',
      monthlyEquivalent: 'Rs. 2,500 / month equivalent',
      savings: 'You save Rs. 1,500',
      features: [
        'Full Gym Access',
        'All Group Classes',
        'Free InBody Scan',
        'Free Steam Bath',
      ],
      featured: true,
      featuredLabel: 'Most Popular Choice',
      ctaLabel: 'Get Started',
    },
    {
      id: 'annual',
      name: 'Annual',
      description: '12-month plan. Maximum gains.',
      price: '25,000',
      currency: 'Rs.',
      monthlyEquivalent: 'Rs. 2,083 / month equivalent',
      savings: 'You save Rs. 11,000',
      features: [
        'Full Gym Access',
        'All Group Classes',
        'Free InBody Scan',
        'Free Steam Bath',
      ],
      featured: false,
      ctaLabel: 'Get Started',
    },
  ],
  comparisonTable: {
    title: 'Compare Feature Plans',
    rows: [
      {
        feature: 'Full Gym Access',
        availability: { monthly: true, quarterly: true, annual: true },
      },
      {
        feature: 'Free InBody Scan',
        availability: { monthly: true, quarterly: true, annual: true },
      },
      {
        feature: 'Free Steam Bath',
        availability: { monthly: true, quarterly: true, annual: true },
      },
      {
        feature: 'All Group Classes (Yoga, Zumba, HIIT)',
        availability: { monthly: false, quarterly: true, annual: true },
      },
    ],
    savings: {
      monthly: '-',
      quarterly: 'Rs. 1,500',
      annual: 'Rs. 11,000',
    },
  },
};

export const mockContactPageData = {
  header: {
    title: 'Get in Touch',
    subtitle: 'Book a free consultation in under 30 seconds.',
  },
  infoPanel: {
    title: 'Stay Connected',
    visitLabel: 'Visit Us',
    callLabel: 'Call Us',
  },
  consultationBenefits: {
    title: 'Why Book a Consultation?',
    items: [
      'Free InBody composition analysis',
      'Custom personalized goal planning',
      'No commitment or pressure required',
    ],
  },
  form: {
    title: 'Book Your Slot',
    submitLabel: 'Send Request',
    submitNote: "We'll call you within 24 hours to confirm your spot.",
    successTitle: 'Request Received',
    successMessage:
      'Thank you! One of our fitness experts will call you within 24 hours to confirm your appointment.',
    successResetLabel: 'Send Another Request',
    placeholders: {
      fullName: 'John Doe',
      phoneNumber: '9876543210',
      message: 'Tell us about your fitness history, injuries, or specific concerns...',
    },
  },
};

export const mockDailyLiveSessionPageData = {
  seo: {
    title: 'Daily Live Session',
    description:
      'Join the latest FitFactor daily live workout. Stream the current session, check the coach schedule, and stay accountable every day.',
  },
  hero: {
    badge: 'Daily Live Session',
    title: 'Train With Today\'s Live Coaching Session',
    description:
      'The latest workout video is uploaded to Mux by the FitFactor admin team and turns into a scheduled live-style stream automatically.',
  },
  session: {
    title: 'Morning Fat Burn Flow',
    description:
      'A focused conditioning session designed for busy professionals who want high energy without wasting time.',
    coachName: 'Coach Arjun',
    scheduledAt: '2026-03-17T06:00:00+05:30',
    status: 'live',
    playbackEnabled: false,
    playbackId: '',
    endsAt: '',
    videoDurationSeconds: 0,
    accessNote: 'The session timing follows the Mux video length automatically once the upload is ready.',
  },
  highlights: [
    'Admins can upload workout videos in advance to Mux and set the exact date and start time.',
    'Members who join late land on the current live point instead of the beginning of the workout.',
    'Once the uploaded video reaches its natural end, the stream closes for everyone on the site.',
  ],
};

export const mockAdminPortalData = {
  login: {
    title: 'Admin Login',
    description: 'Sign in to manage live workout schedules and publish upcoming sessions.',
    helperText:
      'Admins authenticate with JWT sessions. Passwords are bcrypt-hashed before they are stored in MongoDB.',
  },
  signup: {
    title: 'Create Admin Account',
    description:
      'Register a new FitFactor admin account with a username and password so the schedule can be managed securely.',
    helperText:
      'If you configure an invite code on the backend, it must be entered here before a new admin can be created.',
  },
  manager: {
    title: 'Daily Live Session Manager',
    description:
      'Upload the workout to Mux, schedule the exact date and start time, and let the public site switch into live mode automatically.',
    saveLabel: 'Save Scheduled Session',
    updateLabel: 'Update Session',
    resetLabel: 'Create New Session',
    logoutLabel: 'Log Out',
    listTitle: 'Scheduled Sessions & Past Uploads',
  },
};
