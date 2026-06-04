export const site = {
  name: 'LiftTrack',
  tagline: 'Train smart. Eat smarter.',
  description:
    'Personal fitness + nutrition AI tracker. Log every rep, snap every meal, see why progress moves.',
  url: 'https://lifttrack.getsetmvp.com',
  ogImage: '/og.png',
  twitter: '@yashgptdev',
  email: 'yash.gupta.developer@gmail.com',
  playStoreUrl:
    'https://play.google.com/store/apps/details?id=com.getsetmvp.lifttrack',
  appStoreUrl: null as string | null,
  github: null as string | null,
  brand: '#14B8A6',
  brandDeep: '#0D9488',
  brandAccent: '#F97316',
  brandAccentDeep: '#EA580C',
  androidPackage: 'com.getsetmvp.lifttrack',
  version: '1.0.0',
  launchDate: '2026-07-15',
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Screenshots', href: '#screens' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'FAQ', href: '#faq' },
  ],
};

export type Site = typeof site;
