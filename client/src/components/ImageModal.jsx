import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, Copy, Check, Calendar, Cpu, Sparkles, Maximize2 } from 'lucide-react';
import imageService from '../services/imageService';
import { useToast } from '../context/ToastContext';

const ImageModal = ({ image, isOpen, onClose, onDeleteClick }) => {
  const { success, error } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopied(true);
      success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error('Failed to copy prompt');
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    const result = await imageService.downloadImage(
      image.imageUrl,
      image.prompt,
      image.createdAt
    );
    setDownloading(false);
    if (result) {
      success('Image downloaded successfully!');
    }
  };

  const formattedDate = new Date(image.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-auto"
        >
          {/* Top Bar Header with Close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                <Cpu className="w-3 h-3 mr-1" />
                {image.model}
              </span>
              {image.aspectRatio && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {image.aspectRatio}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Preview Container */}
            <div className="lg:col-span-7 bg-slate-950/90 flex items-center justify-center p-4 sm:p-6 min-h-[350px] sm:min-h-[460px] relative group">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl transition-transform duration-300"
                loading="eager"
              />
              <a
                href={image.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute top-6 right-6 p-2 rounded-lg bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
                title="View Full Resolution"
              >
                <Maximize2 className="w-4 h-4" />
              </a>
            </div>

            {/* Sidebar Details Container */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Prompt Details */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Prompt
                    </span>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-xs flex items-center space-x-1 text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 select-all max-h-36 overflow-y-auto">
                    {image.prompt}
                  </p>
                </div>

                {/* Negative Prompt if any */}
                {image.negativePrompt && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Negative Prompt
                    </span>
                    <p className="text-xs text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
                      {image.negativePrompt}
                    </p>
                  </div>
                )}

                {/* Metadata badges */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-slate-400 block mb-1">Model</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {image.model}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-slate-400 block mb-1">Created</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                      {formattedDate}
                    </span>
                  </div>
                  {image.width && image.height && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Resolution</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {image.width} × {image.height}
                      </span>
                    </div>
                  )}
                  {image.quality && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Quality</span>
                      <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {image.quality}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 hover:opacity-95 shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Downloading...' : 'Download Image'}</span>
                </button>

                <button
                  onClick={() => onDeleteClick(image)}
                  className="p-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                  title="Delete generation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageModal;

