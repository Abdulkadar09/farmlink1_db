import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { MapPin, Navigation, X, Check, Copy } from 'lucide-react';

export const MapModal: React.FC = () => {
  const { mapModal, closeMapModal } = useFarmLink();
  const [copied, setCopied] = useState(false);

  if (!mapModal.isOpen) return null;

  const handleCopyCoord = () => {
    navigator.clipboard.writeText(`${mapModal.coordinates.lat.toFixed(4)}, ${mapModal.coordinates.lng.toFixed(4)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="farm-map-modal-dialog"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 leading-tight">{mapModal.title}</h3>
              {mapModal.subtitle && (
                <p className="text-xs text-stone-500">{mapModal.subtitle}</p>
              )}
            </div>
          </div>
          <button
            id="btn-close-map-modal"
            onClick={closeMapModal}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Visualization Canvas Simulation */}
        <div className="p-6 overflow-y-auto">
          <div className="relative w-full h-64 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-inner flex flex-col items-center justify-center">
            {/* Styled vector map grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />
            
            {/* Topographic farm fields visual styling */}
            <div className="absolute w-72 h-44 bg-emerald-100/50 rounded-full blur-xl -top-10 -left-10" />
            <div className="absolute w-60 h-40 bg-amber-100/60 rounded-full blur-xl -bottom-10 -right-10" />

            {/* Farm Pin Marker */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-full shadow-md mb-1 whitespace-nowrap flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Verified Farm Coordinates
              </div>
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="w-3 h-1.5 bg-black/20 rounded-full blur-xs mt-1"></div>
            </div>

            {/* Scale & Distance indicator */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-700 shadow-xs border border-stone-200 flex items-center gap-2">
              <span>GPS: {mapModal.coordinates.lat.toFixed(4)}°N, {mapModal.coordinates.lng.toFixed(4)}°E</span>
            </div>

            <div className="absolute top-3 right-3 bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              Direct Route Ready
            </div>
          </div>

          <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Physical Gate / Farm Pickup Address
            </div>
            <div className="text-sm font-medium text-stone-800 leading-relaxed">
              {mapModal.address}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                id="btn-copy-gps-coords"
                type="button"
                onClick={handleCopyCoord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Coordinates!' : 'Copy Coordinates'}
              </button>
              <a
                id="link-google-maps-external"
                href={`https://www.google.com/maps/search/?api=1&query=${mapModal.coordinates.lat},${mapModal.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open External GPS Navigation
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            id="btn-close-map-modal-action"
            type="button"
            onClick={closeMapModal}
            className="px-5 py-2 text-sm font-medium bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
