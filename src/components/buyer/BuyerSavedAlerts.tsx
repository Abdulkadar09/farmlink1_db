import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  BellRing,
  Plus,
  Trash2,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const BuyerSavedAlerts: React.FC = () => {
  const {
    currentUser,
    savedAlerts,
    crops,
    listings,
    addAlert,
    deleteAlert,
    openConfirmation,
    setActiveTab
  } = useFarmLink();

  const myAlerts = savedAlerts.filter(a => a.buyerId === currentUser?.id);

  // New alert modal state per specification
  const [showAddModal, setShowAddModal] = useState(false);
  const [alertCrop, setAlertCrop] = useState(crops[0]?.name || 'Tomatoes (Hybrid)');
  const [alertRadius, setAlertRadius] = useState<number>(10); // default 10km per spec
  const [alertMaxPrice, setAlertMaxPrice] = useState<number | ''>('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert(alertCrop, alertRadius, alertMaxPrice ? Number(alertMaxPrice) : undefined);
    setSuccessMsg(true);
    setTimeout(() => {
      setShowAddModal(false);
      setSuccessMsg(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Saved Produce Alerts
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Get automated SMS and dashboard alerts whenever farmers within your radius post new harvest batches.
          </p>
        </div>

        {/* Button: "Add New Alert" per specification */}
        <button
          id="btn-add-new-alert"
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Alert</span>
        </button>
      </div>

      {/* Alerts List */}
      {myAlerts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">No Saved Alerts Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Set an alert for any crop (e.g. Tomatoes or Wheat) within a 10km radius. FarmLink notifies you instantly when fresh produce is posted.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            Create 10km Crop Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myAlerts.map(alert => {
            // Count matching active listings in marketplace
            const matchingListings = listings.filter(l =>
              l.status === 'Active' &&
              l.cropName.toLowerCase().includes(alert.cropName.toLowerCase()) &&
              l.distanceKm <= alert.radiusKm
            );

            return (
              <div
                key={alert.id}
                id={`saved-alert-card-${alert.id}`}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 leading-tight">
                      {alert.cropName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        Within {alert.radiusKm} km radius
                      </span>
                      {alert.maxTargetPrice && (
                        <>
                          <span>•</span>
                          <span>Target max: ₹{alert.maxTargetPrice}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Created {alert.createdAt}</span>
                    </div>

                    {matchingListings.length > 0 && (
                      <div className="mt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>{matchingListings.length} active harvest {matchingListings.length === 1 ? 'batch' : 'batches'} ready to negotiate</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {matchingListings.length > 0 && (
                    <button
                      onClick={() => setActiveTab('search-discover')}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Per alert: Button "Delete Alert" per specification */}
                  <button
                    id={`btn-delete-alert-${alert.id}`}
                    type="button"
                    onClick={() =>
                      openConfirmation({
                        title: 'Delete Saved Alert?',
                        message: `Remove the automatic alert for ${alert.cropName} within ${alert.radiusKm}km?`,
                        confirmLabel: 'Delete Alert',
                        isDestructive: true,
                        onConfirm: () => deleteAlert(alert.id)
                      })
                    }
                    className="p-2.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Alert Modal per specification: Dropdown Crop, Input Radius (default 10km) → "Save Alert" */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Add Crop Alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-8 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Alert Configured!</h4>
                <p className="text-xs text-stone-500">
                  You will receive immediate notifications when farmers post {alertCrop} within {alertRadius}km.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveAlert} className="p-6 space-y-4">
                
                {/* Dropdown: Crop per spec */}
                <div>
                  <label htmlFor="select-alert-crop" className="block text-xs font-semibold text-stone-700 mb-1">
                    Select Produce / Crop *
                  </label>
                  <select
                    id="select-alert-crop"
                    value={alertCrop}
                    onChange={e => setAlertCrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    {crops.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name} (Mandi: ₹{c.mandiPrice}/{c.baseUnit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input: Radius (default 10km) per spec */}
                <div>
                  <label htmlFor="input-alert-radius" className="block text-xs font-semibold text-stone-700 mb-1">
                    Radius from Farm Gate (km) *
                  </label>
                  <input
                    id="input-alert-radius"
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={alertRadius}
                    onChange={e => setAlertRadius(Number(e.target.value))}
                    placeholder="10"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Default 10 km covers local farm gates accessible for same-day Cash on Pickup.
                  </span>
                </div>

                {/* Target Max Price (optional) */}
                <div>
                  <label htmlFor="input-alert-max-price" className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Max Asking Price (₹/unit, optional)
                  </label>
                  <input
                    id="input-alert-max-price"
                    type="number"
                    min={1}
                    value={alertMaxPrice}
                    onChange={e => setAlertMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 26.00"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                {/* Button: "Save Alert" per spec */}
                <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-alert-submit"
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Alert
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
