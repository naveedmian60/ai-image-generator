import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Zap,
  SlidersHorizontal,
  History,
  ShieldCheck,
  ArrowRight,
  Layers,
  Palette,
  CheckCircle,
  Stars,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const heroImageSample = {
    prompt:
      'A cybernetic neon city floating above misty clouds at dusk, bioluminescent towering spires, flying luminous vehicles, cinematic atmospheric lighting, octane render, 8k resolution',
    model: 'Flux.1 Dev',
    aspectRatio: '16:9',
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  };

  const showcaseSamples = [
    {
      title: 'Neon Cyberpunk Metropolis',
      prompt: 'Futuristic sci-fi skyline bathed in indigo and magenta neon glow, hyper-detailed reflections',
      model: 'Flux.1 Schnell',
      ratio: '16:9',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Celestial Dreamscape',
      prompt: 'A glass astronaut floating through an amethyst nebula with sparkling starlight fragments',
      model: 'Flux.1 Dev',
      ratio: '1:1',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Anime Fantasy Princess',
      prompt: 'Anime portrait of a crystal mage with glowing silver hair, ethereal butterflies, cel shaded',
      model: 'Anime Diffusion',
      ratio: '3:4',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const features = [
    {
      icon: Layers,
      title: 'Multiple AI Models',
      desc: 'Switch between Flux.1 Schnell, Flux.1 Dev, SDXL Turbo, Anime Diffusion, and OpenAI DALL-E 3 with a single click.'
    },
    {
      icon: Zap,
      title: 'Fast Generation',
      desc: 'Optimized inference pipelines delivering photorealistic renders in as little as 2 to 4 seconds.'
    },
    {
      icon: SlidersHorizontal,
      title: 'High Quality & Aspect Ratios',
      desc: 'Render in 1:1, 16:9 widescreen, 9:16 portrait, 4:3, or 3:4 tailored for social media, wallpapers, and marketing.'
    },
    {
      icon: History,
      title: 'Generation History',
      desc: 'Permanent gallery to view, inspect full prompts, download high-res files, and manage previous generations.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Accounts',
      desc: 'Bcrypt hashed passwords, protected JWT sessions, and private user galleries stored with enterprise hygiene.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose a Model',
      desc: 'Select from our state-of-the-art catalog of diffusion architectures tuned for photorealism, speed, or illustrative style.'
    },
    {
      number: '02',
      title: 'Write Your Prompt',
      desc: 'Describe your vision in plain English. Fine-tune optional aspect ratio, quality settings, or negative prompts.'
    },
    {
      number: '03',
      title: 'Generate Your Image',
      desc: 'Watch the AI synthesize your concept into an ultra-sharp, high-resolution visual masterpiece in real time.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-brand-600/20 via-pink-500/20 to-indigo-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Next-Generation Multi-Model AI Engine</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Turn Your Ideas Into{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Stunning Images
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            Create unique AI-generated images from simple text prompts. Choose your model,
            describe your idea, and let AI bring it to life.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to={isAuthenticated ? '/generate' : '/signup'}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 hover:opacity-95 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center space-x-2.5 group"
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/history"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-slate-700 dark:text-slate-200 glass-card hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Generations</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual Preview Showcase (Section 36) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 sm:mt-20 max-w-5xl mx-auto rounded-3xl glass-card overflow-hidden p-2 sm:p-4 shadow-2xl border border-slate-200/80 dark:border-slate-800/80"
        >
          <div className="rounded-2xl overflow-hidden bg-slate-950 relative group">
            {/* Top Prompt Overlay Bar */}
            <div className="absolute top-0 inset-x-0 z-10 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center space-x-1.5">
                  <Stars className="w-3.5 h-3.5" />
                  <span>Prompt Concept</span>
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2">
                  "{heroImageSample.prompt}"
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {heroImageSample.model}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-slate-300">
                  {heroImageSample.aspectRatio}
                </span>
              </div>
            </div>

            {/* Showcase Image */}
            <img
              src={heroImageSample.imageUrl}
              alt="AI Generated Sample Visual"
              className="w-full h-[320px] sm:h-[480px] lg:h-[540px] object-cover group-hover:scale-102 transition-transform duration-700"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Engineered For Excellence
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need To Create
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            A production-ready suite designed for fluid iteration, high resolution, and limitless creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-8 rounded-3xl glass-card transition-all relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-pink-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}

          {/* Bonus CTA card inside grid */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-pink-600 text-white flex flex-col justify-between shadow-xl shadow-brand-500/20">
            <div className="space-y-3">
              <Palette className="w-8 h-8 text-white/90" />
              <h4 className="text-2xl font-bold">Infinite Styles</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                From photorealism and isometric 3D renders to cinematic anime and oil paintings.
              </p>
            </div>
            <Link
              to="/generate"
              className="mt-6 inline-flex items-center space-x-2 text-sm font-bold bg-white text-brand-700 px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors self-start"
            >
              <span>Try PixelForge Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works (Section 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-card p-8 sm:p-14 border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Three Simple Steps
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How PixelForge Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col p-6 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-4"
              >
                <span className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-pink-500 bg-clip-text text-transparent">
                  {step.number}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA (Section 7) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-brand-500/30">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to create something amazing?
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Start generating now and transform your creative vision into high-resolution visuals.
            </p>
            <div className="pt-2">
              <Link
                to={isAuthenticated ? '/generate' : '/signup'}
                className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl font-bold text-base text-brand-950 bg-white hover:bg-slate-100 shadow-xl transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Start Generating Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

