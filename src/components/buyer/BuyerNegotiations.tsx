import React, { useState, useMemo, useEffect } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Negotiation } from '../../types';
import {
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  X,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Phone
} from 'lucide-react';

export const BuyerNegotiations: React.FC = () => {
  const {
    currentUser,
    negotiations,
    listings,
    acceptOffer,
    rejectOffer,
    counterOffer,
    openConfirmation,
    setActiveTab,
    selectedNegotiationId,
    setSelectedNegotiationId
  } = useFarmLink();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'completed' | 'closed'>('active');
  const [threadModalNeg, setThreadModalNeg] = useState<Negotiation | null>(null);

  // Counter form state
  const [counterPrice, setCounterPrice] = useState<number | ''>('');
  const [counterQty, setCounterQty] = useState<number | ''>('');
  const [counterNote, setCounterNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter buyer's negotiations
  const myNegotiations = useMemo(() => {
    return negotiations.filter(n => n.buyerId === currentUser?.id);
  }, [negotiations, currentUser]);

  const activeList = useMemo(() => myNegotiations.filter(n => n.status === 'active'), [myNegotiations]);
  const completedList = useMemo(() => myNegotiations.filter(n => n.status === 'accepted'), [myNegotiations]);
  const closedList = useMemo(() => myNegotiations.filter(n => n.status === 'rejected' || n.status === 'expired'), [myNegotiations]);

  const currentDisplayList = useMemo(() => {
    if (activeSubTab === 'active') return activeList;
    if (activeSubTab === 'completed') return completedList;
    return closedList;
  }, [activeSubTab, activeList, completedList, closedList]);

  const handleOpenThread = (neg: Negotiation) => {
    setThreadModalNeg(neg);
    const lastRound = neg.rounds[neg.rounds.length - 1];
    setCounterPrice(lastRound.offeredPrice);
    setCounterQty(lastRound.quantity);
    setCounterNote('');
    setErrorMsg('');
  };

  // Auto-open negotiation thread if user clicked a notification for a specific negotiation
  useEffect(() => {
    if (selectedNegotiationId) {
      const matched = myNegotiations.find(n => n.id === selectedNegotiationId);
      if (matched) {
        if (matched.status === 'active') setActiveSubTab('active');
        else if (matched.status === 'accepted') setActiveSubTab('completed');
        else setActiveSubTab('closed');
        handleOpenThread(matched);
      }
      setSelectedNegotiationId(null);
    }
  }, [selectedNegotiationId, myNegotiations, setSelectedNegotiationId]);

  const handleSendCounter = (negId: string) => {
    if (!counterPrice || Number(counterPrice) <= 0) {
      setErrorMsg('Please specify counter price per unit.');
      return;
    }
    counterOffer(
      negId,
      Number(counterPrice),
      counterQty ? Number(counterQty) : undefined,
      counterNote.trim() || undefined
    );
    // Refresh modal with latest state
    setThreadModalNeg(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          My Negotiations
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Transparent 4-round negotiations with local growers. Accepted terms automatically become Cash on Pickup orders.
        </p>
      </div>

      {/* Sub-tabs: Active / Completed / Rejected/Expired per specification */}
      <div className="flex border-b border-stone-200 mb-6 gap-6">
        <button
          id="subtab-negotiations-active"
          type="button"
          onClick={() => setActiveSubTab('active')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'active'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Active Ongoing</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-800">
            {activeList.length}
          </span>
        </button>

        <button
          id="subtab-negotiations-completed"
          type="button"
          onClick={() => setActiveSubTab('completed')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'completed'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Completed (Orders)</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-stone-100 text-stone-700">
            {completedList.length}
          </span>
        </button>

        <button
          id="subtab-negotiations-closed"
          type="button"
          onClick={() => setActiveSubTab('closed')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'closed'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Rejected / Expired</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-stone-100 text-stone-700">
            {closedList.length}
          </span>
        </button>
      </div>

      {/* Content List */}
      {currentDisplayList.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">
            No {activeSubTab === 'active' ? 'Active' : activeSubTab === 'completed' ? 'Completed' : 'Closed'} Negotiations
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Discover local farm listings and start a negotiation offer to secure fair wholesale pricing.
          </p>
          <button
            onClick={() => setActiveTab('search-discover')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            Browse Harvest Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentDisplayList.map(neg => {
            const latestRound = neg.rounds[neg.rounds.length - 1];
            const isMyTurn = neg.turn === 'buyer';
            const isRound4 = neg.currentRound >= 4;

            return (
              /* Card per negotiation: Crop, Farmer, Current round, Latest offer amount */
              <div
                key={neg.id}
                id={`negotiation-card-${neg.id}`}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top bar with round and status */}
                  <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-stone-200 text-stone-800 rounded-full">
                        Round {neg.currentRound} of 4
                      </span>
                      {neg.status === 'active' && isMyTurn && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full animate-pulse">
                          Your Turn to Respond
                        </span>
                      )}
                      {neg.status === 'active' && !isMyTurn && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold bg-stone-200 text-stone-700 rounded-full">
                          Awaiting Farmer Response
                        </span>
                      )}
                    </div>

                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full uppercase ${
                      neg.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : neg.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {neg.status}
                    </span>
                  </div>

                  {/* Negotiation Body Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-stone-900">{neg.cropName}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Farmer: <strong>{neg.farmerName}</strong> • Phone: {neg.farmerPhone}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">
                          Latest Offer
                        </span>
                        <span className="text-base font-bold text-emerald-800">
                          ₹{latestRound.offeredPrice} <span className="text-xs text-stone-600">/ {neg.unit}</span>
                        </span>
                      </div>
                    </div>

                    {/* Round & Quantity snapshot */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 mb-4 space-y-1">
                      <div className="flex justify-between">
                        <span>Offered by:</span>
                        <strong className="text-stone-800">
                          {latestRound.senderRole === 'buyer' ? 'You (Buyer)' : `Farmer (${neg.farmerName})`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <strong className="text-stone-800">{latestRound.quantity} {neg.unit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Batch Commitment:</span>
                        <strong className="text-stone-900">₹{latestRound.totalAmount.toLocaleString()}</strong>
                      </div>
                      {latestRound.message && (
                        <div className="pt-1 text-[11px] text-stone-500 italic">
                          "{latestRound.message}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons Bar per specification: View Thread, Accept, Reject, Counter Offer */}
                <div className="p-4 pt-0 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Button: "View Thread" per spec */}
                  <button
                    id={`btn-view-thread-${neg.id}`}
                    type="button"
                    onClick={() => handleOpenThread(neg)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Thread</span>
                  </button>

                  {/* Context-dependent action buttons if active */}
                  {neg.status === 'active' && (
                    <div className="flex items-center gap-1.5">
                      {isMyTurn ? (
                        <>
                          <button
                            id={`btn-buyer-reject-${neg.id}`}
                            type="button"
                            onClick={() =>
                              openConfirmation({
                                title: 'Reject Farmer Counter?',
                                message: `Decline farmer ${neg.farmerName}'s counter offer of ₹${latestRound.offeredPrice}/${neg.unit}? This will terminate the negotiation.`,
                                confirmLabel: 'Reject',
                                isDestructive: true,
                                onConfirm: () => rejectOffer(neg.id)
                              })
                            }
                            className="px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-xl border border-red-200"
                          >
                            Reject
                          </button>

                          {!isRound4 && (
                            <button
                              id={`btn-buyer-counter-${neg.id}`}
                              type="button"
                              onClick={() => handleOpenThread(neg)}
                              className="px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-300 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> Counter
                            </button>
                          )}

                          <button
                            id={`btn-buyer-accept-${neg.id}`}
                            type="button"
                            onClick={() =>
                              openConfirmation({
                                title: 'Accept Farmer Counter Offer?',
                                message: `Accept ₹${latestRound.offeredPrice}/${neg.unit} for ${latestRound.quantity} ${neg.unit}? An order will be created immediately for Cash on Pickup.`,
                                confirmLabel: 'Accept Offer',
                                isDestructive: false,
                                onConfirm: () => acceptOffer(neg.id)
                              })
                            }
                            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-2xs"
                          >
                            Accept
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Farmer reviewing</span>
                      )}
                    </div>
                  )}

                  {neg.status === 'accepted' && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <span>View Pickup Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Thread Modal with full Round 1–4 history per specification */}
      {threadModalNeg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  Negotiation Thread: {threadModalNeg.cropName}
                </h3>
                <span className="text-xs text-stone-500">
                  Farmer: {threadModalNeg.farmerName} • Round {threadModalNeg.currentRound} of 4
                </span>
              </div>
              <button
                type="button"
                onClick={() => setThreadModalNeg(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Full Rounds 1-4 list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Full Round Progression:
                </h4>
                <div className="space-y-3">
                  {threadModalNeg.rounds.map(round => {
                    const isBuyer = round.senderRole === 'buyer';
                    return (
                      <div
                        key={round.roundNumber}
                        className={`p-4 rounded-2xl border text-xs ${
                          isBuyer
                            ? 'bg-stone-50 border-stone-200 ml-4 sm:ml-8'
                            : 'bg-emerald-50/50 border-emerald-200 mr-4 sm:mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-stone-900">
                            Round {round.roundNumber} ({isBuyer ? 'You / Buyer' : `Farmer ${threadModalNeg.farmerName}`})
                          </span>
                          <span className="text-[11px] font-mono text-stone-400">{round.timestamp}</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-900">
                          ₹{round.offeredPrice} / {threadModalNeg.unit} • {round.quantity} {threadModalNeg.unit}
                        </div>
                        <div className="text-stone-600 mt-0.5">
                          Total Value: ₹{round.totalAmount.toLocaleString()}
                        </div>
                        {round.message && (
                          <div className="mt-2 text-stone-700 italic bg-white p-2 rounded-lg border border-stone-100">
                            "{round.message}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counter Input Form if Active and Buyer's Turn */}
              {threadModalNeg.status === 'active' && threadModalNeg.turn === 'buyer' && (
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="font-bold text-xs text-stone-900 flex items-center justify-between">
                    <span>Submit Buyer Counter for Round {threadModalNeg.currentRound + 1} of 4:</span>
                    {threadModalNeg.currentRound >= 4 && (
                      <span className="text-amber-700 text-[11px]">Round 4 reached: Only Accept or Reject</span>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="text-xs text-red-600 font-medium">{errorMsg}</div>
                  )}

                  {threadModalNeg.currentRound < 4 ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Counter Offer (₹ / {threadModalNeg.unit}) *
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={counterPrice}
                            onChange={e => setCounterPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Quantity ({threadModalNeg.unit})
                          </label>
                          <input
                            type="number"
                            value={counterQty}
                            onChange={e => setCounterQty(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Counter Note to Farmer
                        </label>
                        <input
                          type="text"
                          value={counterNote}
                          onChange={e => setCounterNote(e.target.value)}
                          placeholder="e.g. Can meet in the middle if pickup tomorrow morning..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendCounter(threadModalNeg.id)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Counter Offer</span>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

            </div>

            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Rule: Negotiations close upon acceptance, rejection, or expiration of Round 4.
              </span>
              <button
                type="button"
                onClick={() => setThreadModalNeg(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl"
              >
                Close Thread
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
