import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Wand2,
  Calendar,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import imageService from '../services/imageService';
import modelService from '../services/modelService';
import ImageModal from '../components/ImageModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SkeletonCard from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

const History = () => {
  const { success, error: toastError } = useToast();

  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModelFilter, setSelectedModelFilter] = useState('all');

  // Custom Dropdown State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modals state
  const [previewImage, setPreviewImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch generations
  const loadGenerations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await imageService.getGenerations({
        model: selectedModelFilter,
        q: searchQuery
      });
      setGenerations(data.generations || []);
    } catch (err) {
      console.error('Failed to load generations:', err);
      toastError('Failed to load your generations history.');
    } finally {
      setLoading(false);
    }
  }, [selectedModelFilter, searchQuery, toastError]);

  // Load models for filter dropdown
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const list = await modelService.getModels();
        setModels(list);
      } catch (err) {
        console.error('Failed to fetch models for filter:', err);
      }
    };
    fetchModels();
  }, []);

  // Debounced load on search or filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadGenerations();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadGenerations]);

  // Handle Download
  const handleDownload = async (img, e) => {
    e?.stopPropagation();
    const result = await imageService.downloadImage(img.imageUrl, img.prompt, img.createdAt);
    if (result) {
      success('Image downloaded successfully!');
    }
  };

  // Open Delete confirmation
  const triggerDelete = (img, e) => {
    e?.stopPropagation();
    setImageToDelete(img);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);
    try {
      await imageService.deleteGeneration(imageToDelete._id);
      setGenerations((prev) => prev.filter((item) => item._id !== imageToDelete._id));
      success('Generation deleted successfully.');
      if (previewImage && previewImage._id === imageToDelete._id) {
        setPreviewImage(null);
      }
      setImageToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      toastError('Failed to delete generation.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get current selected model label for dropdown button
  const selectedModelObj = models.find((m) => m.id === selectedModelFilter);
  const currentModelLabel = selectedModelFilter === 'all' ? 'All AI Models' : selectedModelObj?.name || 'All AI Models';

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
            <Images className="w-8 h-8 text-brand-500 shrink-0" />
            <span>Generation Gallery</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, inspect, download, and manage your AI-generated artworks.
          </p>
        </div>

        <Link
          to="/generate"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-pink-500 hover:opacity-95 shadow-md shadow-brand-500/20 w-full md:w-auto shrink-0"
        >
          <Wand2 className="w-4 h-4" />
          <span>Generate New Image</span>
        </Link>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 w-full relative z-30">
        {/* Search Input (Bigger on PC using sm:flex-1) */}
        <div className="relative w-full sm:flex-1 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search prompt keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Custom Model Filter Dropdown (Compact on PC using sm:w-64) */}
        <div className="flex items-center gap-2 w-full sm:w-64 relative" ref={dropdownRef}>
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          
          <div className="relative w-full">
            {/* Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <span className="truncate">{currentModelLabel}</span>
              <svg 
                className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Options */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-60 overflow-y-auto py-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModelFilter('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 ${
                    selectedModelFilter === 'all' ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''
                  }`}
                >
                  All AI Models
                </button>
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModelFilter(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 truncate ${
                      selectedModelFilter === m.id ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : generations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 px-4 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No generations yet.
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create your first AI image and turn your ideas into reality.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/generate"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-brand-500/20 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Start Creating</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {generations.map((gen) => (
            <motion.div
              key={gen._id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setPreviewImage(gen)}
              className="group cursor-pointer rounded-3xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-slate-950 overflow-hidden">
                <img
                  src={gen.imageUrl}
                  alt={gen.prompt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(gen);
                    }}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                    title="Preview Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDownload(gen, e)}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                    title="Download Image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => triggerDelete(gen, e)}
                    className="p-3 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {gen.aspectRatio && (
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white">
                    {gen.aspectRatio}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                  {gen.prompt}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    {gen.model}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(gen.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Preview Modal */}
      <ImageModal
        isOpen={Boolean(previewImage)}
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onDeleteClick={(img) => {
          setImageToDelete(img);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(imageToDelete)}
        isDeleting={isDeleting}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default History;