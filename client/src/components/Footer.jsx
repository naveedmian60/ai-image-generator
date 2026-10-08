import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Cpu, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-lightBorder/80 dark:border-darkBorder/80 bg-slate-50/50 dark:bg-slate-950/40 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-brand-600 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
                PixelForge AI
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Create production-grade visual assets with cutting-edge diffusion models.
              Fast, high-fidelity, and engineered for creators, designers, and developers.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand-500" />
                <span>Multi-Model AI</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enterprise Security</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Persistent Storage</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Generate Studio
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Generation Gallery
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Models & Tech
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Flux.1 Schnell & Dev</li>
              <li>SDXL Turbo Diffusion</li>
              <li>OpenAI DALL-E 3</li>
              <li>MERN Full-Stack</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} PixelForge AI. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Engineered with precision for modern creators</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

