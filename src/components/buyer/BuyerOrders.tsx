import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Order } from '../../types';
import {
  PackageCheck,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  User,
  ExternalLink,
  ShieldAlert,
  Send,
  Calendar,
  Layers
} from 'lucide-react';

export const BuyerOrders: React.FC = () => {
  const {
    currentUser,
    orders,
    completeOrder,
    fileDispute,
    openConfirmation,
    openMapModal,
    setActiveTab
  } = useFarmLink();

  // Filter buyer orders
  const myOrders = useMemo(() => {
    return orders.filter(o => o.buyerId === currentUser?.id);
  }, [orders, currentUser]);

  // Contact Modal state
  const [contactOrder, setContactOrder] = useState<Order | null>(null);

  // Report an Issue Modal state per specification
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [disputeReason, setDisputeReason] = useState('Quality mismatch from negotiated sample');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  const handleOpenContact = (order: Order) => {
    setContactOrder(order);
  };

  const handleOpenDispute = (order: Order) => {
    setDisputeOrder(order);
    setDisputeReason('Quality mismatch from negotiated sample');
    setDisputeNotes('');
    setDisputeSuccess(false);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeOrder || !disputeNotes.trim()) return;

    fileDispute(
      disputeOrder.id,
      `${disputeReason}: ${disputeNotes.trim()}`
    );

    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeOrder(null);
      setDisputeSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          My Farm Gate Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Agreed contracts from accepted negotiations. Collect produce at the farm gate and settle payment via Cash on Pickup.
        </p>
      </div>

      {myOrders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">No Orders Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            When you and a farmer agree on an offer price and quantity, the finalized order will appear here for pickup.
          </p>
          <button
            onClick={() => setActiveTab('search-discover')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl"
          >
            Start Negotiating Produce
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myOrders.map(order => (
            /* Order Card per specification: Crop, Farmer, Final Price, Quantity, Pickup location, Status */
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header Banner with status */}
                <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-900">Order #{order.id}</span>
                    <span className="text-[11px] text-stone-500 block">Accepted on {order.createdAt}</span>
                  </div>

                  <span
                    id={`order-status-${order.id}`}
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      order.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Disputed'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'Cancelled'
                        ? 'bg-stone-200 text-stone-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{order.cropName}</h3>
                      <div className="text-xs text-stone-600 mt-0.5">
                        Farmer: <strong className="text-stone-900">{order.farmerName}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Agreed Price
                      </span>
                      <span className="text-lg font-bold text-emerald-800">
                        ₹{order.agreedPrice ?? order.finalPricePerUnit} <span className="text-xs font-medium text-stone-600">/ {order.unit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Total Value Box */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Batch Quantity:</span>
                      <strong className="text-stone-900">{order.quantity} {order.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Total Settle Amount:</span>
                      <strong className="text-emerald-950 font-bold text-sm">
                        ₹{order.totalAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-500 text-[11px]">
                      <span>Payment Method:</span>
                      <span className="font-semibold text-stone-800">Cash on Pickup</span>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">Pickup Location:</span>
                      <span className="text-stone-600 leading-relaxed">{order.pickupLocation}</span>
                    </div>
                  </div>

                  {(order.disputeNote || order.disputeReason) && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs">
                      <strong>Issue Logged to Admin:</strong> {order.disputeNote || order.disputeReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Bar per specification:
                  - Button: "View Farmer Contact"
                  - Button: "Get Directions" (map link to farm GPS pin)
                  - Button: "Mark as Picked Up" (buyer confirms Cash on Pickup completion)
                  - Button: "Report an Issue" (opens simple dispute note field → logs to admin)
              */}
              <div className="p-4 pt-0 border-t border-stone-100 space-y-2">
                
                {order.status === 'Pending Pickup' && (
                  <button
                    id={`btn-mark-picked-up-${order.id}`}
                    type="button"
                    onClick={() =>
                      openConfirmation({
                        title: 'Confirm Cash on Pickup Completion?',
                        message: `Confirming you have collected ${order.quantity} ${order.unit} of ${order.cropName} from ${order.farmerName} and settled ₹${order.totalAmount.toLocaleString()} in cash.`,
                        confirmLabel: 'Confirm Pickup & Complete',
                        isDestructive: false,
                        onConfirm: () => completeOrder(order.id)
                      })
                    }
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Picked Up (Confirm Payment)</span>
                  </button>
                )}

                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Button: "View Farmer Contact" */}
                  <button
                    id={`btn-view-contact-${order.id}`}
                    type="button"
                    onClick={() => handleOpenContact(order)}
                    className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>Contact</span>
                  </button>

                  {/* Button: "Get Directions" */}
                  <button
                    id={`btn-get-directions-${order.id}`}
                    type="button"
                    onClick={() =>
                      openMapModal({
                        title: `Directions to ${order.farmerName}'s Gate`,
                        subtitle: `${order.cropName} Pickup Point`,
                        coordinates: order.coordinates,
                        address: order.pickupLocation
                      })
                    }
                    className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Directions</span>
                  </button>

                  {/* Button: "Report an Issue" */}
                  <button
                    id={`btn-report-issue-${order.id}`}
                    type="button"
                    onClick={() => handleOpenDispute(order)}
                    className="px-2.5 py-2 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Issue</span>
                  </button>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* View Farmer Contact Modal */}
      {contactOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Farmer Direct Contact</h3>
              </div>
              <button
                type="button"
                onClick={() => setContactOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                  {contactOrder.farmerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">{contactOrder.farmerName}</h4>
                  <span className="text-xs text-stone-500">Produce Supplier for Order #{contactOrder.id}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Mobile Phone:</span>
                  <a href={`tel:${contactOrder.farmerPhone}`} className="font-bold text-emerald-900 text-sm hover:underline">
                    {contactOrder.farmerPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Farm Address:</span>
                  <span className="font-medium text-stone-800 text-right max-w-xs">{contactOrder.pickupLocation}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                Call the grower prior to dispatching your vehicle to ensure the crates are packed at the gate.
              </p>

              <button
                onClick={() => setContactOrder(null)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl"
              >
                Close Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report an Issue Modal per specification (logs to admin) */}
      {disputeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-stone-900 text-sm">Report Dispute to FarmLink Admin</h3>
              </div>
              <button
                type="button"
                onClick={() => setDisputeOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {disputeSuccess ? (
              <div className="p-8 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Dispute Logged to Marketplace Admin</h4>
                <p className="text-xs text-stone-500">
                  The supervisory team has flagged Order #{disputeOrder.id} and will contact both parties.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="p-6 space-y-4">
                <div className="text-xs text-stone-600">
                  Reporting Order #{disputeOrder.id} ({disputeOrder.cropName} from {disputeOrder.farmerName}):
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dispute Reason Category
                  </label>
                  <select
                    value={disputeReason}
                    onChange={e => setDisputeReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Quality mismatch from negotiated sample">Quality mismatch from negotiated sample</option>
                    <option value="Quantity short weight at gate">Quantity short weight at gate</option>
                    <option value="Farmer unavailable for pickup">Farmer unavailable for pickup</option>
                    <option value="Price discrepancy at cash settlement">Price discrepancy at cash settlement</option>
                    <option value="Damaged/spoiled produce upon arrival">Damaged/spoiled produce upon arrival</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Details / Evidence Notes *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={disputeNotes}
                    onChange={e => setDisputeNotes(e.target.value)}
                    placeholder="Describe what occurred during the farm gate pickup..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setDisputeOrder(null)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Dispute</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
