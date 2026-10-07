import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  Sprout,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  UploadCloud
} from 'lucide-react';

export const FarmerAddListing: React.FC = () => {
  const { crops, addListing, currentUser, setActiveTab, openMapModal } = useFarmLink();

  const [searchCrop, setSearchCrop] = useState('');
  const [selectedCropName, setSelectedCropName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('kg');
  const [askingPrice, setAskingPrice] = useState<number | ''>('');
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(
    currentUser?.farmLocation
      ? {
          lat: currentUser.farmLocation.lat,
          lng: currentUser.farmLocation.lng,
          address: currentUser.farmAddress || 'Farm Gate GPS Pin'
        }
      : null
  );
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  );
  const [availableForDelivery, setAvailableForDelivery] = useState(false);
  const [notes, setNotes] = useState('');
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Filter crops for typeahead
  const filteredCrops = useMemo(() => {
    if (!searchCrop.trim()) return crops;
    return crops.filter(c =>
      c.name.toLowerCase().includes(searchCrop.toLowerCase())
    );
  }, [crops, searchCrop]);

  // Selected crop benchmark price hint
  const selectedCropObj = useMemo(() => {
    return crops.find(c => c.name === selectedCropName);
  }, [crops, selectedCropName]);

  const handleSelectCrop = (crop: (typeof crops)[0]) => {
    setSelectedCropName(crop.name);
    setSearchCrop(crop.name);
    setUnit(crop.baseUnit);
    // Suggest asking price near mandi benchmark
    if (!askingPrice) {
      setAskingPrice(crop.mandiPrice);
    }
  };

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address:
              currentUser?.farmAddress ||
              `Farm Gate GPS (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
          };
          setGpsLocation(loc);
          setIsCapturingGps(false);
        },
        _err => {
          // Fallback to simulated high-accuracy Pune farm location
          const fallback = {
            lat: 18.8472,
            lng: 73.8964,
            address:
              currentUser?.farmAddress ||
              'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune, MH'
          };
          setGpsLocation(fallback);
          setIsCapturingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLocation({
        lat: 18.8472,
        lng: 73.8964,
        address:
          currentUser?.farmAddress ||
          'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune, MH'
      });
      setIsCapturingGps(false);
    }
  };

  const handleClearForm = () => {
    setSearchCrop('');
    setSelectedCropName('');
    setQuantity('');
    setUnit('kg');
    setAskingPrice('');
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setAvailableForDelivery(false);
    setNotes('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropName) {
      setFormError('Please select a crop from the Mandi Price Index.');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setFormError('Please enter a valid harvest quantity available.');
      return;
    }
    if (!askingPrice || Number(askingPrice) <= 0) {
      setFormError('Please state your Asking Price per unit.');
      return;
    }

    setFormError('');

    addListing({
      cropName: selectedCropName,
      quantity: Number(quantity),
      unit,
      askingPrice: Number(askingPrice),
      harvestDate,
      distanceKm: 5.5,
      farmAddress:
        gpsLocation?.address ||
        currentUser?.farmAddress ||
        'Verified Farm Gate, Taluka Road',
      coordinates: gpsLocation
        ? { lat: gpsLocation.lat, lng: gpsLocation.lng }
        : { lat: 18.8472, lng: 73.8964 },
      photoUrl,
      availableForDelivery,
      notes: notes.trim() || undefined
    });
  };

  // Sample Produce Photos to pick from
  const SAMPLE_PHOTOS = [
    {
      name: 'Tomatoes',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Cauliflower',
      url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Wheat',
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Basmati Rice',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Onions',
      url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Green Chilies',
      url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Potatoes',
      url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Mangoes',
      url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header Banner */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Post Produce for Direct Negotiation
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Buyers will review your Asking Price and Mandi hint to submit structured offer rounds.
            </p>
          </div>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Crop Selection & Mandi Hint */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            1. Crop & Benchmark Index
          </h2>

          <div className="relative">
            <label htmlFor="input-search-crop" className="block text-xs font-semibold text-stone-700 mb-1">
              Select Crop (Searchable Typeahead) *
            </label>
            <input
              id="input-search-crop"
              type="text"
              required
              value={searchCrop}
              onChange={e => {
                setSearchCrop(e.target.value);
                if (selectedCropName && e.target.value !== selectedCropName) {
                  setSelectedCropName('');
                }
              }}
              placeholder="Start typing crop name (e.g., Tomatoes, Onions, Wheat)..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
            />

            {/* Typeahead Suggestions dropdown */}
            {!selectedCropName && searchCrop && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-xl border border-stone-200 max-h-56 overflow-y-auto divide-y divide-stone-100">
                {filteredCrops.length === 0 ? (
                  <div className="p-3 text-xs text-stone-500 text-center">
                    No matching APMC crops found. You can still type custom produce name.
                  </div>
                ) : (
                  filteredCrops.map(crop => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelectCrop(crop)}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-emerald-50 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-stone-900">{crop.name}</span>
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        Mandi: ₹{crop.mandiPrice}/{crop.baseUnit}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Mandi Price Hint Display (Auto-shown when crop selected) */}
          {selectedCropObj ? (
            <div 
              id="mandi-price-hint-box"
              className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Live Mandi Price Hint ({selectedCropObj.category})
                  </div>
                  <div className="text-base font-bold text-emerald-900 mt-0.5">
                    ₹{selectedCropObj.mandiPrice} per {selectedCropObj.baseUnit}
                  </div>
                  <p className="text-xs text-emerald-800/80 mt-1">
                    APMC Benchmark range: ₹{selectedCropObj.mandiPriceRange.min} – ₹{selectedCropObj.mandiPriceRange.max} / {selectedCropObj.baseUnit}. Updated {selectedCropObj.lastUpdated}.
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-full uppercase">
                Fair Guide
              </span>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">
              💡 Select a crop from the typeahead to view live Mandi price index hints to inform your Asking Price.
            </p>
          )}
        </div>

        {/* Section 2: Quantity & Asking Price */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            2. Quantity & Asking Price
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Quantity Available */}
            <div>
              <label htmlFor="input-quantity-available" className="block text-xs font-semibold text-stone-700 mb-1">
                Quantity Available *
              </label>
              <input
                id="input-quantity-available"
                type="number"
                min={1}
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Unit Dropdown */}
            <div>
              <label htmlFor="select-unit-dropdown" className="block text-xs font-semibold text-stone-700 mb-1">
                Unit *
              </label>
              <select
                id="select-unit-dropdown"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden bg-white cursor-pointer"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="crate">crate (Crate / Box)</option>
                <option value="dozen">dozen (12 Units)</option>
                <option value="quintal">quintal (100 kg)</option>
                <option value="bag">bag (Standard 50kg bag)</option>
              </select>
            </div>

            {/* Asking Price per unit */}
            <div>
              <label htmlFor="input-asking-price" className="block text-xs font-semibold text-stone-700 mb-1">
                Asking Price (₹ / {unit}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                <input
                  id="input-asking-price"
                  type="number"
                  step="0.5"
                  min={0.5}
                  required
                  value={askingPrice}
                  onChange={e => setAskingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="25.00"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Harvest Date (Date Picker) */}
          <div>
            <label htmlFor="input-harvest-date" className="block text-xs font-semibold text-stone-700 mb-1">
              Harvest Date (Pick date) *
            </label>
            <input
              id="input-harvest-date"
              type="date"
              required
              value={harvestDate}
              onChange={e => setHarvestDate(e.target.value)}
              className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
            />
          </div>
        </div>

        {/* Section 3: GPS Location & Farm Photo */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            3. Farm GPS Location & Produce Photo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Capture GPS Location */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Farm Gate GPS Location
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Enables accurate distance calculation and Cash on Pickup directions for buyers.
                </p>

                {gpsLocation ? (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-stone-700 mb-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-950">GPS Pin Confirmed:</div>
                      <div className="text-[11px] text-stone-600 truncate">{gpsLocation.address}</div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                        {gpsLocation.lat.toFixed(4)}°N, {gpsLocation.lng.toFixed(4)}°E
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-400 mb-3">
                    No GPS coordinates captured yet.
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  id="btn-capture-gps-location"
                  type="button"
                  disabled={isCapturingGps}
                  onClick={handleCaptureGps}
                  className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-emerald-900 border border-emerald-300 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isCapturingGps ? 'Detecting Satellite GPS...' : 'Capture GPS Location'}</span>
                </button>

                {gpsLocation && (
                  <button
                    type="button"
                    onClick={() =>
                      openMapModal({
                        title: 'Farm Gate GPS Pin',
                        subtitle: selectedCropName ? `Harvest Listing for ${selectedCropName}` : undefined,
                        coordinates: { lat: gpsLocation.lat, lng: gpsLocation.lng },
                        address: gpsLocation.address
                      })
                    }
                    className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300"
                    title="View pin on map"
                  >
                    View
                  </button>
                )}
              </div>
            </div>

            {/* Upload Photo Button & Preview */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Produce / Farm Photo
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Upload fresh crop image or select a certified batch photo.
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={photoUrl}
                    alt="Produce preview"
                    className="w-16 h-16 rounded-xl object-cover border border-stone-300 shadow-xs"
                  />
                  <div className="text-xs text-stone-600">
                    <span className="font-semibold text-stone-800 block">High-Resolution Photo</span>
                    Selected for marketplace card
                  </div>
                </div>
              </div>

              <div>
                <button
                  id="btn-upload-photo"
                  type="button"
                  onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                  className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-600" />
                  <span>Upload / Choose Produce Photo</span>
                </button>
              </div>
            </div>

          </div>

          {/* Photo Picker Drawer */}
          {showPhotoPicker && (
            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-800">
                  Select Certified Sample Photo or Paste URL:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(false)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
                {SAMPLE_PHOTOS.map(sample => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(sample.url);
                      setShowPhotoPicker(false);
                    }}
                    className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                      photoUrl === sample.url ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-12 object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or enter image URL (https://...)"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(false)}
                  className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Delivery Checkbox per specification */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                id="checkbox-farmer-delivery"
                type="checkbox"
                checked={availableForDelivery}
                onChange={e => setAvailableForDelivery(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 border-stone-300 focus:ring-emerald-700"
              />
              <span className="font-semibold">Available for farmer delivery</span>
              <span className="text-stone-500 font-normal">(Optional: feeds logistics module if you can drop off at buyer location)</span>
            </label>
          </div>

          {/* Optional Notes */}
          <div>
            <label htmlFor="input-listing-notes" className="block text-xs font-semibold text-stone-700 mb-1">
              Quality Notes & Grading (Optional)
            </label>
            <textarea
              id="input-listing-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Grade-A sorted, sun-ripened, moisture tested, pesticide-free harvest..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons: "Submit Listing" & "Cancel / Clear Form" per spec */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            id="btn-cancel-clear-form"
            type="button"
            onClick={handleClearForm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel / Clear Form
          </button>
          
          <button
            id="btn-submit-listing"
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Submit Listing</span>
          </button>
        </div>

      </form>
    </div>
  );
};
