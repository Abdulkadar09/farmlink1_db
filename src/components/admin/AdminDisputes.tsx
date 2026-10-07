import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Order } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Phone,
  Calendar,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const AdminDisputes: React.FC = () => {
  const { orders, resolveDispute, dismissDispute, openConfirmation } = useFarmLink();

  // All disputed or previously disputed orders
  const disputedOrders = orders.filter(o => o.status === 'Disputed' || o.disputeNote);

  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (order: Order) => {
    openConfirmation({
      title: `Resolve Dispute for Order #${order.id}?`,
      message: `Mark this dispute as resolved? This records admin mediation and updates order status to Completed or Settled.`,
      confirmLabel: 'Mark Resolved',
      isDestructive: false,
      onConfirm: () => {
        resolveDispute(order.id, 'Resolved after admin mutual mediation');
        setSelectedDisputeOrder(null);
      }
    });
  };

  const handleDismiss = (order: Order) => {
    openConfirmation({
      title: `Dismiss Dispute for Order #${order.id}?`,
      message: `Dismiss this report as unsubstantiated? The order status will revert to its prior state.`,
      confirmLabel: 'Dismiss Report',
      isDestructive: true,
      onConfirm: () => {
        dismissDispute(order.id);
        setSelectedDisputeOrder(null);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Disputes & Resolution Queue
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Manage reported shortfalls, cash payment issues, and quality discrepancies reported at the farm gate.
        </p>
      </div>

      {/* Table per specification: Dispute ID, Reported By, Order ID, Reason, Status (Open / Resolved / Dismissed), Actions */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Dispute ID</th>
                <th className="py-3.5 px-6">Reported By (Buyer)</th>
                <th className="py-3.5 px-6">Order ID & Crop</th>
                <th className="py-3.5 px-6">Dispute Reason</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {disputedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No active disputes reported. All farm pickups settled cleanly.
                  </td>
                </tr>
              ) : (
                disputedOrders.map(order => {
                  const isOpen = order.status === 'Disputed';
                  const disputeId = `DSP-${order.id.slice(-4)}`;

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      {/* Dispute ID */}
                      <td className="py-4 px-6 font-mono font-bold text-stone-900">
                        {disputeId}
                      </td>

                      {/* Reported By (Buyer) */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-stone-800">{order.buyerName}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{order.buyerPhone}</div>
                      </td>

                      {/* Order ID & Crop */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-stone-900">{order.cropName}</div>
                        <div className="text-[11px] text-stone-400">Order #{order.id} • Farmer: {order.farmerName}</div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-6 max-w-xs truncate font-medium text-stone-700">
                        {order.disputeNote || 'Produce specification discrepancy at gate'}
                      </td>

                      {/* Status (Open / Resolved / Dismissed) */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          isOpen
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOpen ? 'Open' : 'Resolved'}
                        </span>
                      </td>

                      {/* Actions per specification:
                          - Button per dispute: "View Details"
                          - Button per dispute: "Resolve"
                          - Button per dispute: "Dismiss"
                      */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Details */}
                          <button
                            id={`btn-view-dispute-${order.id}`}
                            type="button"
                            onClick={() => setSelectedDisputeOrder(order)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="View Dispute Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isOpen && (
                            <>
                              {/* Resolve */}
                              <button
                                id={`btn-resolve-dispute-${order.id}`}
                                type="button"
                                onClick={() => handleResolve(order)}
                                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Resolve</span>
                              </button>

                              {/* Dismiss */}
                              <button
                                id={`btn-dismiss-dispute-${order.id}`}
                                type="button"
                                onClick={() => handleDismiss(order)}
                                className="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Dismiss</span>
                              </button>
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dispute Details Modal */}
      {selectedDisputeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Dispute Dossier: DSP-{selectedDisputeOrder.id.slice(-4)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDisputeOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-red-900">
                <span className="font-bold block mb-1">Reported Issue Details:</span>
                <p className="leading-relaxed">
                  {selectedDisputeOrder.disputeNote || 'No specific dispute statement recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Crop & Batch</span>
                  <span className="font-bold text-stone-900">{selectedDisputeOrder.cropName}</span>
                  <div className="text-stone-500 mt-0.5">{selectedDisputeOrder.quantity} {selectedDisputeOrder.unit}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Agreed Value</span>
                  <span className="font-bold text-emerald-800">₹{selectedDisputeOrder.totalAmount.toLocaleString()}</span>
                  <div className="text-stone-500 mt-0.5">₹{selectedDisputeOrder.agreedPrice} / {selectedDisputeOrder.unit}</div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Farmer:</span>
                  <span className="font-bold text-stone-900">{selectedDisputeOrder.farmerName} ({selectedDisputeOrder.farmerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Buyer:</span>
                  <span className="font-bold text-stone-900">{selectedDisputeOrder.buyerName} ({selectedDisputeOrder.buyerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pickup Location:</span>
                  <span className="text-stone-800 font-medium text-right">{selectedDisputeOrder.pickupLocation}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                {selectedDisputeOrder.status === 'Disputed' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDismiss(selectedDisputeOrder)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                    >
                      Dismiss Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(selectedDisputeOrder)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDisputeOrder(null)}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
