import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { ProduceListing } from '../../types';
import {
  Sprout,
  Flag,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  MapPin,
  Calendar,
  Send
} from 'lucide-react';

export const AdminListings: React.FC = () => {
  const { listings, flagListing, openMapModal } = useFarmLink();

  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  
  // Flag / Remove modal state
  const [flaggingListing, setFlaggingListing] = useState<ProduceListing | null>(null);
  const [flagReason, setFlagReason] = useState('Misrepresented quality / grading grade');

  const handleConfirmFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingListing) return;
    flagListing(flaggingListing.id, flagReason);
    setFlaggingListing(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Produce Listing Moderation
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Inspect farmer harvest postings, monitor Asking Price adherence to Mandi spreads, and flag non-compliant listings.
        </p>
      </div>

      {/* Table: Crop, Farmer, Quantity, Asking Price, Harvest Date, Status, Actions */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Produce / Crop</th>
                <th className="py-3.5 px-6">Farmer</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Asking Price</th>
                <th className="py-3.5 px-6">Harvest Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {listings.map(listing => (
                <tr key={listing.id} className="hover:bg-stone-50/70 transition-colors">
                  
                  {/* Crop */}
                  <td className="py-4 px-6 font-bold text-stone-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.photoUrl}
                        alt={listing.cropName}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div>{listing.cropName}</div>
                        <div className="text-[11px] font-mono text-stone-400">ID: #{listing.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Farmer */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-stone-800">{listing.farmerName}</div>
                    <div className="text-[11px] text-stone-400">{listing.farmAddress}</div>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-6 font-semibold">
                    {listing.quantity} {listing.unit}
                  </td>

                  {/* Asking Price */}
                  <td className="py-4 px-6 font-bold text-emerald-900">
                    ₹{listing.askingPrice} / {listing.unit}
                  </td>

                  {/* Harvest Date */}
                  <td className="py-4 px-6 font-mono text-stone-600">
                    {listing.harvestDate}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      listing.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : listing.status === 'Flagged'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {listing.status}
                    </span>
                  </td>

                  {/* Actions per specification:
                      - Button per listing: "Remove / Flag" (with reason input)
                      - Button per listing: "View"
                  */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Button: "View" */}
                      <button
                        id={`btn-admin-view-listing-${listing.id}`}
                        type="button"
                        onClick={() => setSelectedListing(listing)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="View Listing Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Button: "Remove / Flag" */}
                      {listing.status !== 'Flagged' && (
                        <button
                          id={`btn-admin-flag-listing-${listing.id}`}
                          type="button"
                          onClick={() => setFlaggingListing(listing)}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Flag / Remove</span>
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Listing Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-sm">
                Listing Moderation: {selectedListing.cropName}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <img
                src={selectedListing.photoUrl}
                alt={selectedListing.cropName}
                className="w-full h-48 rounded-2xl object-cover border border-stone-200"
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Farmer Name</span>
                  <span className="font-bold text-stone-900">{selectedListing.farmerName}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Asking Price</span>
                  <span className="font-bold text-emerald-800">₹{selectedListing.askingPrice} / {selectedListing.unit}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Harvest Quantity</span>
                  <span className="font-bold text-stone-900">{selectedListing.quantity} {selectedListing.unit}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-0.5">Harvest Date</span>
                  <span className="font-bold text-stone-900">{selectedListing.harvestDate}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                <span className="text-stone-400 block">Pickup Coordinates & Gate Address:</span>
                <span className="font-medium text-stone-800 block">{selectedListing.farmAddress}</span>
                <span className="font-mono text-stone-400 text-[11px] block">
                  {selectedListing.coordinates.lat}°N, {selectedListing.coordinates.lng}°E
                </span>
              </div>

              {selectedListing.notes && (
                <div className="p-3 bg-stone-50 rounded-xl text-xs italic text-stone-600">
                  "{selectedListing.notes}"
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    openMapModal({
                      title: selectedListing.cropName,
                      coordinates: selectedListing.coordinates,
                      address: selectedListing.farmAddress
                    })
                  }
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                >
                  Inspect GPS Gate Pin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove / Flag Modal with reason input per specification */}
      {flaggingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-bold text-stone-900 text-sm">Remove / Flag Listing</h3>
              </div>
              <button
                type="button"
                onClick={() => setFlaggingListing(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmFlag} className="p-6 space-y-4">
              <p className="text-xs text-stone-600">
                You are removing the listing for <strong>{flaggingListing.cropName}</strong> by farmer <strong>{flaggingListing.farmerName}</strong> from active buyer search.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reason for Removal / Moderation Flag *
                </label>
                <select
                  value={flagReason}
                  onChange={e => setFlagReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Misrepresented quality / grading grade">Misrepresented quality / grading grade</option>
                  <option value="Duplicate or fraudulent harvest entry">Duplicate or fraudulent harvest entry</option>
                  <option value="Price significantly diverges from Mandi range">Price significantly diverges from Mandi range</option>
                  <option value="Invalid farm gate GPS coordinate">Invalid farm gate GPS coordinate</option>
                  <option value="Seller uncontactable or unresponsive">Seller uncontactable or unresponsive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setFlaggingListing(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Confirm Removal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
