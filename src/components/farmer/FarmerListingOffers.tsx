import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { ProduceListing, Negotiation } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  User,
  Phone,
  Send,
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface FarmerListingOffersProps {
  listing: ProduceListing;
  onBack: () => void;
}

export const FarmerListingOffers: React.FC<FarmerListingOffersProps> = ({ listing, onBack }) => {
  const {
    negotiations,
    acceptOffer,
    rejectOffer,
    counterOffer,
    openConfirmation,
    openMapModal
  } = useFarmLink();

  // Negotiations matching this listing
  const listingNegotiations = negotiations.filter(n => n.listingId === listing.id);

  const [counterInputOpenId, setCounterInputOpenId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number | ''>('');
  const [counterMessage, setCounterMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenCounter = (neg: Negotiation) => {
    setCounterInputOpenId(neg.id);
    const lastRound = neg.rounds[neg.rounds.length - 1];
    // Pre-populate counter price between buyer offer and asking price
    const midPrice = Math.round(((lastRound.offeredPrice + listing.askingPrice) / 2) * 10) / 10;
    setCounterPrice(midPrice);
    setCounterMessage('');
    setErrorMsg('');
  };

  const handleSendCounter = (negotiationId: string) => {
    if (!counterPrice || Number(counterPrice) <= 0) {
      setErrorMsg('Please specify a valid counter offer price.');
      return;
    }

    counterOffer(negotiationId, Number(counterPrice), undefined, counterMessage.trim() || undefined);
    setCounterInputOpenId(null);
    setCounterPrice('');
    setCounterMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Back Button */}
      <button
        id="btn-back-to-my-listings"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 px-3 py-1.5 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Listings
      </button>

      {/* Listing Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={listing.photoUrl}
            alt={listing.cropName}
            className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{listing.cropName}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                listing.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
              }`}>
                {listing.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1.5">
              <span><strong>Asking Price:</strong> ₹{listing.askingPrice}/{listing.unit}</span>
              <span>•</span>
              <span><strong>Available:</strong> {listing.quantity} {listing.unit}</span>
              <span>•</span>
              <span><strong>Harvest Date:</strong> {listing.harvestDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            openMapModal({
              title: 'Farm Gate Location',
              subtitle: listing.cropName,
              coordinates: listing.coordinates,
              address: listing.farmAddress
            })
          }
          className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>View Farm Gate</span>
        </button>
      </div>

      {/* Incoming Offers Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Incoming Negotiation Offers ({listingNegotiations.length})
          </h2>
          <p className="text-xs text-stone-500">
            Structured 4-round negotiations. You can Accept, Reject, or Send a Counter Offer.
          </p>
        </div>
      </div>

      {listingNegotiations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">No Offers Received Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Buyers discovering your {listing.cropName} listing will submit offers based on current Mandi benchmarks.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl"
          >
            Return to My Listings
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {listingNegotiations.map(neg => {
            const latestRound = neg.rounds[neg.rounds.length - 1];
            const isRound4 = neg.currentRound >= 4;
            const isCounterOpen = counterInputOpenId === neg.id;

            return (
              <div
                key={neg.id}
                id={`offer-card-${neg.id}`}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Offer Card Top Bar */}
                <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {neg.buyerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                        <span>{neg.buyerName}</span>
                        <span className="text-xs font-mono text-stone-500 font-normal flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {neg.buyerPhone}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        Negotiation ID: #{neg.id} • Started {new Date(neg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status & Round Badge */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-stone-200/80 text-stone-800 text-xs font-bold rounded-full">
                      Round {neg.currentRound} of 4
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      neg.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : neg.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {neg.status}
                    </span>
                  </div>
                </div>

                {/* Offer Details Body */}
                <div className="p-6">
                  
                  {/* Latest Offer Metric Box */}
                  <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block">
                        Latest Offer Amount (Round {latestRound.roundNumber} from {latestRound.senderRole === 'buyer' ? 'Buyer' : 'Farmer'})
                      </span>
                      <div className="text-2xl font-serif font-bold text-emerald-950 mt-0.5">
                        ₹{latestRound.offeredPrice} <span className="text-sm font-sans font-medium text-stone-600">/ {neg.unit}</span>
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        Requested Quantity: <strong>{latestRound.quantity} {neg.unit}</strong> • Total Value:{' '}
                        <strong>₹{latestRound.totalAmount.toLocaleString()}</strong> (Cash on Pickup)
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Your Asking Price:</span>
                      <span className="text-base font-bold text-stone-800">
                        ₹{listing.askingPrice} / {neg.unit}
                      </span>
                      <div className="text-[11px] font-medium text-stone-500">
                        Difference: ₹{(listing.askingPrice - latestRound.offeredPrice).toFixed(1)} / {neg.unit}
                      </div>
                    </div>
                  </div>

                  {/* Negotiation Rounds History (Rounds 1-4) */}
                  <div className="mb-6 space-y-3">
                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Negotiation Thread History:
                    </h3>
                    <div className="space-y-2 border-l-2 border-stone-200 pl-4 ml-2">
                      {neg.rounds.map(round => (
                        <div key={round.roundNumber} className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-800">
                              Round {round.roundNumber} ({round.senderRole === 'buyer' ? 'Buyer Offer' : 'Farmer Counter'}):
                            </span>
                            <span className="font-semibold text-emerald-800">
                              ₹{round.offeredPrice}/{neg.unit} for {round.quantity} {neg.unit}
                            </span>
                            <span className="text-stone-400 font-mono text-[11px]">• {round.timestamp}</span>
                          </div>
                          {round.message && (
                            <p className="text-stone-600 mt-0.5 italic">"{round.message}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Offer Actions (Accept / Reject / Counter) */}
                  {neg.status === 'active' && (
                    <div>
                      {isCounterOpen ? (
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-300 space-y-3 animate-in fade-in">
                          <div className="font-bold text-xs text-stone-900">
                            Submit Counter Offer for Round {neg.currentRound + 1} of 4:
                          </div>

                          {errorMsg && (
                            <div className="text-xs text-red-600 font-medium">{errorMsg}</div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Counter Price (₹ / {neg.unit}) *
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                min={1}
                                required
                                value={counterPrice}
                                onChange={e => setCounterPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Note / Reason for Counter (Optional)
                              </label>
                              <input
                                type="text"
                                value={counterMessage}
                                onChange={e => setCounterMessage(e.target.value)}
                                placeholder="e.g. Can do ₹24.50 for this Grade-A sorting batch..."
                                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setCounterInputOpenId(null)}
                              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendCounter(neg.id)}
                              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Counter Offer</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                          
                          {/* Reject Offer Button */}
                          <button
                            id={`btn-reject-offer-${neg.id}`}
                            type="button"
                            onClick={() =>
                              openConfirmation({
                                title: 'Reject Buyer Offer?',
                                message: `Are you sure you want to decline the offer of ₹${latestRound.offeredPrice}/${neg.unit} from ${neg.buyerName}? This will close the negotiation thread.`,
                                confirmLabel: 'Reject Offer',
                                isDestructive: true,
                                onConfirm: () => rejectOffer(neg.id)
                              })
                            }
                            className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>Reject Offer</span>
                          </button>

                          {/* Counter Offer Button (Disabled or hidden on round 4 per prompt specification) */}
                          {!isRound4 ? (
                            <button
                              id={`btn-counter-offer-${neg.id}`}
                              type="button"
                              onClick={() => handleOpenCounter(neg)}
                              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-4 h-4 text-stone-600" />
                              <span>Counter Offer</span>
                            </button>
                          ) : (
                            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                              Round 4 reached: Only Accept or Reject permitted
                            </span>
                          )}

                          {/* Accept Offer Button */}
                          <button
                            id={`btn-accept-offer-${neg.id}`}
                            type="button"
                            onClick={() =>
                              openConfirmation({
                                title: 'Accept Offer & Generate Order?',
                                message: `Accepting ₹${latestRound.offeredPrice}/${neg.unit} for ${latestRound.quantity} ${neg.unit} (Total ₹${latestRound.totalAmount.toLocaleString()}) will automatically generate a Cash on Pickup Order.`,
                                confirmLabel: 'Accept Offer',
                                isDestructive: false,
                                onConfirm: () => acceptOffer(neg.id)
                              })
                            }
                            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Offer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {neg.status === 'accepted' && (
                    <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span className="font-semibold">
                          Offer accepted at ₹{neg.finalPrice}/{neg.unit} for {neg.finalQuantity} {neg.unit}! Order generated for Cash on Pickup.
                        </span>
                      </div>
                    </div>
                  )}

                  {neg.status === 'rejected' && (
                    <div className="p-3.5 bg-stone-100 text-stone-600 rounded-2xl border border-stone-200 text-xs">
                      This negotiation was closed.
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
