import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Maximize,
  HelpCircle,
  AlertCircle,
  Dices,
  Eye,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import modelService from '../services/modelService';
import imageService from '../services/imageService';
import { useToast } from '../context/ToastContext';

const samplePrompts = [
  'A majestic cybernetic tiger with glowing azure circuits wandering through a misty Kyoto bamboo forest at night, octane render, 8k',
  'An ethereal underwater palace carved from iridescent sea crystals, glowing bioluminescent jellyfish floating around, volumetric lighting',
  'A vintage retro-futuristic laboratory with copper piping, glowing vacuum tubes, and an holographic astronomical map, cinematic lighting',
  'A dreamy pastel studio portrait of a magical botanical fox with blooming peony flowers around its ears, hyper-detailed fantasy art',
  'Futuristic architectural villa hanging over a Norwegian fjord at sunset, minimalist Scandinavian aesthetic, floor-to-ceiling glass'
];

const aspectRatios = [
  { id: '1:1', label: '1:1 Square', icon: '■', desc: 'Social posts & avatars' },
  { id: '16:9', label: '16:9 Landscape', icon: '▬', desc: 'Desktop & widescreen' },
  { id: '9:16', label: '9:16 Portrait', icon: '▮', desc: 'Stories & mobile' },
  { id: '4:3', label: '4:3 Standard', icon: '▭', desc: 'Classic photography' },
  { id: '3:4', label: '3:4 Vertical', icon: '▯', desc: 'Editorial & portraits' }
];

const Generate = () => {
  const { success, error: toastError } = useToast();

  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('flux-schnell');
  const [modelsLoading, setModelsLoading] = useState(true);

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const [generatedResult, setGeneratedResult] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Load available models from backend
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await modelService.getModels();
        setModels(data);
        if (data.length > 0) {
          setSelectedModelId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load models:', err);
        toastError('Failed to load models catalog.');
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, [toastError]);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Adjust aspect ratio if current is unsupported by newly chosen model
  useEffect(() => {
    if (selectedModel && !selectedModel.supportedAspectRatios?.includes(aspectRatio)) {
      setAspectRatio(selectedModel.defaultAspectRatio || '1:1');
    }
  }, [selectedModel, aspectRatio]);

  // Loading animation step simulator
  useEffect(() => {
    let interval = null;
    if (isGenerating) {
      setGenerationStep(0);
      const steps = [
        'Analyzing and refining prompt vectors...',
        'Synthesizing latent diffusion layers...',
        'Rendering textures and dynamic lighting...',
        'Finalizing high-resolution details...'
      ];
      let stepIndex = 0;
      interval = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        setGenerationStep(stepIndex);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleRandomPrompt = () => {
    const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(random);
  };

  const handleClear = () => {
    setPrompt('');
    setNegativePrompt('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toastError('Please enter a descriptive prompt to generate an image.');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const result = await imageService.generateImage({
        prompt: prompt.trim(),
        negativePrompt: selectedModel?.supportsNegativePrompt ? negativePrompt.trim() : '',
        model: selectedModelId,
        aspectRatio,
        quality
      });

      setGeneratedResult(result);
      success('Image generated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Generation failed. Please try again.';
      toastError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedResult) return;
    setDownloading(true);
    await imageService.downloadImage(
      generatedResult.imageUrl,
      generatedResult.prompt,
      generatedResult.createdAt
    );
    setDownloading(false);
    success('Image downloaded successfully!');
  };

  const handleCopyPrompt = async () => {
    if (!generatedResult) return;
    try {
      await navigator.clipboard.writeText(generatedResult.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      toastError('Failed to copy prompt');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Image Generator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Select an AI model, craft your prompt, configure dimensions, and bring your imagination to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Model Selection */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-brand-500" />
                  <span>Select AI Model</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Each architecture offers specialized speeds, aesthetics, and resolutions.
                </p>
              </div>
            </div>

            {modelsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {models.map((m) => {
                  const isSelected = selectedModelId === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`relative p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-brand-500/10 dark:bg-brand-950/40 border-brand-500 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {m.name}
                        </span>
                        {m.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-brand-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {m.tagline || m.description}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>{m.speed}</span>
                        </span>
                        <span>•</span>
                        <span>{m.qualityTier}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Prompt Input */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Prompt Description</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Be as descriptive as you like: specify subject, lighting, mood, and style.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800/60 flex items-center space-x-1.5 transition-colors"
                  title="Insert a creative sample prompt"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Inspire Me</span>
                </button>
                {prompt && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Clear prompt"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
                placeholder="Describe the image you want to create..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all"
              />
              <div className="flex justify-between items-center px-1 mt-1 text-[11px] text-slate-400">
                <span>Try adding details like "cinematic lighting", "8k", or "isometric"</span>
                <span>{prompt.length} / 1000</span>
              </div>
            </div>

            {/* Negative Prompt (Section 13) */}
            {selectedModel?.supportsNegativePrompt && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                  <span>Negative Prompt</span>
                  <span className="text-[10px] lowercase text-slate-400 font-normal">
                    (optional elements to avoid)
                  </span>
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. blurry, low quality, distorted, watermark, extra limbs"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          {/* Section 3: Image Settings (Aspect Ratio & Quality) */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-brand-500" />
                <span>Image Settings</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize canvas dimensions and resolution density.
              </p>
            </div>

            {/* Aspect Ratio Options */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {aspectRatios.map((ar) => {
                  const isSupported = selectedModel?.supportedAspectRatios?.includes(ar.id);
                  const isSelected = aspectRatio === ar.id;

                  return (
                    <button
                      key={ar.id}
                      type="button"
                      disabled={!isSupported}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`p-3 rounded-2xl text-center border transition-all flex flex-col items-center justify-center space-y-1 ${
                        !isSupported
                          ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                          : isSelected
                          ? 'bg-brand-500/10 dark:bg-brand-950/50 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-base font-bold">{ar.icon}</span>
                      <span className="text-xs font-semibold">{ar.id}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-full">
                        {ar.id === '1:1' ? 'Square' : ar.id === '16:9' ? 'Wide' : 'Tall'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Setting */}
            {selectedModel?.supportsQuality?.length > 1 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quality Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedModel.supportsQuality.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q)}
                      className={`p-3 rounded-2xl text-center border capitalize font-semibold text-xs transition-all ${
                        quality === q
                          ? 'bg-brand-500/10 dark:bg-brand-950/50 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                          : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {q === 'high' ? 'High / Enhanced' : 'Standard'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Action Button */}
            <motion.button
              whileHover={{ scale: isGenerating || !prompt.trim() ? 1 : 1.01 }}
              whileTap={{ scale: isGenerating || !prompt.trim() ? 1 : 0.98 }}
              disabled={isGenerating || !prompt.trim()}
              onClick={handleGenerate}
              className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 hover:opacity-95 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Image...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Column: Generation Result & Live Preview */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-brand-500" />
              <span>Canvas Result</span>
            </h3>

            {/* State 1: Active Generating Animation (Section 27) */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full aspect-square rounded-2xl bg-slate-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
              >
                {/* Ambient glow pulses */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/30 via-pink-600/20 to-indigo-600/30 blur-2xl animate-pulse" />

                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8 text-brand-400 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      Generating with {selectedModel?.name}
                    </h4>
                    <p className="text-xs text-brand-300 font-medium animate-pulse">
                      {['Synthesizing prompt vectors...', 'Rendering pixels...', 'Optimizing resolution...'][generationStep % 3]}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    Diffusion processes typically complete within 2 to 6 seconds depending on resolution.
                  </p>
                </div>
              </motion.div>
            )}

            {/* State 2: Generated Result */}
            {!isGenerating && generatedResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 group shadow-lg">
                  <img
                    src={generatedResult.imageUrl}
                    alt={generatedResult.prompt}
                    className="w-full h-auto object-contain max-h-[500px] mx-auto"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={generatedResult.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-black/70 text-white/90 hover:text-white backdrop-blur-md"
                      title="Open full size"
                    >
                      <Maximize className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Prompt snippet */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      Prompt
                    </span>
                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center space-x-1 text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-3">
                    {generatedResult.prompt}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 hover:opacity-95 shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Downloading...' : 'Download Image'}</span>
                  </button>

                  <a
                    href="/history"
                    className="py-3 px-4 rounded-xl font-semibold text-xs text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>View in History</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* State 3: Empty Default Placeholder */}
            {!isGenerating && !generatedResult && (
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Canvas Ready
                </h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Enter your prompt on the left and click "Generate Image" to see your visual appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;

