import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { ProduceListing } from '../../types';
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Handshake,
  BellRing,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BuyerListingDetailProps {
  listing: ProduceListing;
  onBack: () => void;
}

export const BuyerListingDetail: React.FC<BuyerListingDetailProps> = ({ listing, onBack }) => {
  const {
    crops,
    currentUser,
    createOffer,
    addAlert,
    openMapModal,
    setActiveTab
  } = useFarmLink();

  const [offerPrice, setOfferPrice] = useState<number | ''>(listing.askingPrice);
  const [offerQuantity, setOfferQuantity] = useState<number | ''>(Math.min(100, listing.quantity));
  const [offerMessage, setOfferMessage] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Find mandi price benchmark
  const mandiCrop = useMemo(() => {
    return crops.find(c => c.name.toLowerCase().includes(listing.cropName.toLowerCase()) || listing.cropName.toLowerCase().includes(c.name.toLowerCase()));
  }, [crops, listing.cropName]);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerPrice || Number(offerPrice) <= 0) {
      setErrorMsg('Please specify a valid offer amount per unit.');
      return;
    }
    if (!offerQuantity || Number(offerQuantity) <= 0) {
      setErrorMsg('Please specify quantity requested.');
      return;
    }
    if (Number(offerQuantity) > listing.quantity) {
      setErrorMsg(`Only ${listing.quantity} ${listing.unit} currently available in this listing.`);
      return;
    }

    setErrorMsg('');
    createOffer(listing.id, Number(offerPrice), Number(offerQuantity), offerMessage.trim() || undefined);
    setOfferSubmitted(true);
  };

  const handleSaveToAlerts = () => {
    addAlert(listing.cropName, 15);
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Button: "Back to Search" per specification */}
      <button
        id="btn-back-to-search"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 px-3 py-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Produce Photo & Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Large Photo per specification */}
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={listing.photoUrl}
              alt={listing.cropName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{listing.distanceKm} km from your location</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-300 font-semibold block">
                  Farmer Asking Price
                </span>
                <div className="text-2xl font-bold font-serif text-emerald-300">
                  ₹{listing.askingPrice} <span className="text-xs font-sans text-stone-300">/ {listing.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-stone-300 font-semibold block">
                  Available Quantity
                </span>
                <span className="text-lg font-bold text-white">
                  {listing.quantity} {listing.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Mandi Benchmark Price Hint Banner */}
          {mandiCrop && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Live Mandi Benchmark Price
                  </div>
                  <div className="text-sm font-bold text-emerald-900">
                    ₹{mandiCrop.mandiPrice} / {mandiCrop.baseUnit} (Range: ₹{mandiCrop.mandiPriceRange.min} - ₹{mandiCrop.mandiPriceRange.max})
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-full">
                APMC Verified
              </span>
            </div>
          )}

          {/* Section: Farmer Info per specification */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Farmer & Gate Information
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                  {listing.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">{listing.farmerName}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Farm
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <div className="flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{listing.farmerRating}</span>
                    </div>
                    <span>•</span>
                    <span>Member since March 2024</span>
                  </div>
                </div>
              </div>

              {/* Button: "View on Map" per specification */}
              <button
                id="btn-view-on-map"
                type="button"
                onClick={() =>
                  openMapModal({
                    title: `${listing.farmerName}'s Farm Location`,
                    subtitle: `Produce Gate for ${listing.cropName}`,
                    coordinates: listing.coordinates,
                    address: listing.farmAddress
                  })
                }
                className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>View on Map</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5 font-medium">Harvest Date</span>
                <span className="font-semibold text-stone-800">{listing.harvestDate}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5 font-medium">Farm Distance</span>
                <span className="font-semibold text-stone-800">{listing.distanceKm} km (Direct GPS Route)</span>
              </div>
            </div>

            {listing.notes && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed italic">
                "{listing.notes}"
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Negotiation Submission Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-lg sticky top-24">
            
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Make an Offer
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Start Round 1 of negotiation directly with farmer {listing.farmerName}. Farmer can Accept, Reject, or Counter.
            </p>

            {offerSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-1">
                  Offer Submitted Successfully!
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  Farmer {listing.farmerName} has been notified via SMS and dashboard alert.
                </p>
                <button
                  id="btn-goto-negotiations"
                  onClick={() => setActiveTab('negotiations')}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl"
                >
                  View in My Negotiations Thread
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Input: Offer Amount */}
                <div>
                  <label htmlFor="input-offer-amount" className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Offer Price (₹ / {listing.unit}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                    <input
                      id="input-offer-amount"
                      type="number"
                      step="0.5"
                      min={1}
                      required
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 24.00"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-base font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-hidden"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Asking Price: ₹{listing.askingPrice}/{listing.unit}</span>
                    {mandiCrop && <span>Mandi: ₹{mandiCrop.mandiPrice}/{listing.unit}</span>}
                  </div>
                </div>

                {/* Input: Quantity requested */}
                <div>
                  <label htmlFor="input-quantity-requested" className="block text-xs font-semibold text-stone-700 mb-1">
                    Quantity Requested ({listing.unit}) *
                  </label>
                  <input
                    id="input-quantity-requested"
                    type="number"
                    min={1}
                    max={listing.quantity}
                    required
                    value={offerQuantity}
                    onChange={e => setOfferQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Max ${listing.quantity}`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-hidden"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Available in this harvest: {listing.quantity} {listing.unit}
                  </span>
                </div>

                {/* Total Calculated Value Banner */}
                {offerPrice && offerQuantity && (
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                    <span className="text-stone-600 font-medium">Total Offer Commitment:</span>
                    <span className="font-bold text-stone-900 text-sm">
                      ₹{(Number(offerPrice) * Number(offerQuantity)).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Optional Message */}
                <div>
                  <label htmlFor="input-buyer-offer-note" className="block text-xs font-semibold text-stone-700 mb-1">
                    Offer Note to Farmer (Optional)
                  </label>
                  <textarea
                    id="input-buyer-offer-note"
                    rows={2}
                    value={offerMessage}
                    onChange={e => setOfferMessage(e.target.value)}
                    placeholder="e.g. Regular wholesale buyer, can pick up within 24 hours of harvest confirmation..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 outline-hidden"
                  />
                </div>

                {/* Button: "Submit Offer" per specification */}
                <button
                  id="btn-submit-offer"
                  type="submit"
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Submit Offer (Round 1)</span>
                </button>

                {/* Button: "Save to Alerts" per specification */}
                <div className="pt-2 border-t border-stone-100 text-center">
                  <button
                    id="btn-save-to-alerts"
                    type="button"
                    onClick={handleSaveToAlerts}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-stone-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{alertSaved ? 'Saved to Alerts!' : 'Save to Alerts (Notify on Similar Batches)'}</span>
                  </button>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Get alerted if other nearby farmers post this crop at lower asking prices.
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
