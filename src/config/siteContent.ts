import { SiteContent } from '../types';

/**
 * ============================================================================
 * ARCLUNOR — Centralized Site Content Store
 * Modify copy, navigation, portfolio exhibits, and contact info here.
 * ============================================================================
 */
export const initialSiteContent: SiteContent = {
  brand: {
    name: 'ARCLUNOR',
  },
  navigation: [
    { id: 'about', label: 'About' },
    { id: 'creations', label: 'Creations' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    title: 'ARCLUNOR',
    headline: 'Creating Beyond Imagination.',
    subtitle: 'An independent creative universe.',
    categories: 'AI · DIGITAL ART · CINEMATIC STORIES · CREATIVE EXPERIMENTS',
    primaryCta: 'EXPLORE MY CREATIONS',
  },
  about: {
    eyebrow: 'ABOUT THE UNIVERSE',
    title: 'Where Algorithmic Synthesis Meets Poetic Restraint.',
    lead: 'ARCLUNOR is an independent creative studio operating at the intersection of artificial intelligence, atmospheric worldbuilding, optical digital sculpture, and serene cinematic storytelling.',
    pillars: [
      {
        icon: 'Cpu',
        title: 'Generative Intelligence',
        desc: 'Harnessing neural synthesis and customized AI pipelines to construct unseen visual dimensions.',
      },
      {
        icon: 'Sparkles',
        title: 'Optical Digital Sculpture',
        desc: 'Crafting light-refracting physical shapes and real-time WebGL translucent crystal environments.',
      },
      {
        icon: 'Eye',
        title: 'Cinematic Worldbuilding',
        desc: 'Slow-paced, contemplative ambient films exploring speculative horizons and emotional clarity.',
      },
    ],
  },
  creations: [
    {
      id: '01',
      title: 'Ethereal Monoliths',
      category: 'AI · Digital Art',
      summary: 'Light-refracting architectural forms suspended in serene skyward horizons.',
      details: 'A multi-part series of computational sculptures exploring monochromatic reflections, translucent optical glass, and high-altitude skyward atmospheres.',
      tags: ['Neural Synthesis', 'Ray Tracing', 'Digital Sculpture'],
      accentColor: '#91D4F2',
    },
    {
      id: '02',
      title: 'Silent Horizons',
      category: 'Cinematic Stories',
      summary: 'Slow-paced speculative visual poetry crafted with generative cinema workflows.',
      details: 'An ambient audio-visual narrative detailing uninhabited atmospheric worlds, volumetric cloud formations, and serene horizon lines.',
      tags: ['Generative Cinema', 'Sound Design', 'Worldbuilding'],
      accentColor: '#65B9EB',
    },
    {
      id: '03',
      title: 'Optical Resonance',
      category: 'Creative Experiments',
      summary: 'Real-time WebGL dispersion and optical crystal acoustics in the browser.',
      details: 'An interactive audio-reactive shader study featuring custom glass transmission materials, refractive light dispersion, and real-time spectral acoustics.',
      tags: ['Three.js', 'Shader Programming', 'Interactive WebGL'],
      accentColor: '#6D9EBF',
    },
  ],
  contact: {
    eyebrow: 'INQUIRIES & COLLABORATIONS',
    title: 'Connect with ARCLUNOR',
    subtitle: 'Open for select creative directional roles, architectural visual studies, and collaborative generative film projects.',
    email: 'studio@arclunor.com',
    socials: [
      { platform: 'YouTube', handle: '@arclunor', url: '#youtube' },
      { platform: 'Instagram', handle: '@arclunor', url: '#instagram' },
      { platform: 'X', handle: '@arclunor', url: '#x' },
    ],
  },
};
