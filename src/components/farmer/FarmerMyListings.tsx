import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { ProduceListing } from '../../types';
import { FarmerListingOffers } from './FarmerListingOffers';
import {
  Plus,
  Edit,
  Clock,
  Trash2,
  Handshake,
  MapPin,
  X,
  Save,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export const FarmerMyListings: React.FC = () => {
  const {
    listings,
    currentUser,
    negotiations,
    updateListing,
    markListingExpired,
    deleteListing,
    setActiveTab,
    selectedListingId,
    setSelectedListingId,
    openConfirmation,
    openMapModal
  } = useFarmLink();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Expired'>('All');
  const [viewOffersListing, setViewOffersListing] = useState<ProduceListing | null>(null);

  // Edit modal state
  const [editingListing, setEditingListing] = useState<ProduceListing | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editHarvestDate, setEditHarvestDate] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Filter listings belonging to current farmer
  const myListings = useMemo(() => {
    return listings.filter(l => l.farmerId === currentUser?.id);
  }, [listings, currentUser]);

  const filteredListings = useMemo(() => {
    if (filterStatus === 'All') return myListings;
    return myListings.filter(l => l.status === filterStatus);
  }, [myListings, filterStatus]);

  const effectiveOffersListing =
    viewOffersListing ||
    (selectedListingId ? listings.find(l => l.id === selectedListingId) || null : null);

  // If farmer clicked "View Offers" on a listing or arrived via notification, render the 6c sub-view
  if (effectiveOffersListing) {
    return (
      <FarmerListingOffers
        listing={effectiveOffersListing}
        onBack={() => {
          setViewOffersListing(null);
          setSelectedListingId(null);
        }}
      />
    );
  }

  const handleOpenEdit = (listing: ProduceListing) => {
    setEditingListing(listing);
    setEditPrice(listing.askingPrice);
    setEditQuantity(listing.quantity);
    setEditHarvestDate(listing.harvestDate);
    setEditNotes(listing.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    updateListing(editingListing.id, {
      askingPrice: Number(editPrice),
      quantity: Number(editQuantity),
      harvestDate: editHarvestDate,
      notes: editNotes.trim() || undefined
    });

    setEditingListing(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            My Harvest Listings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Manage your posted crops, review incoming buyer offers, and track farm gate pickups.
          </p>
        </div>

        <button
          id="btn-post-new-crop"
          onClick={() => setActiveTab('add-listing')}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Filter Bar: Dropdown (Active / Expired / All) per specification */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Filter Status:
          </span>
          <select
            id="filter-listings-status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'All' | 'Active' | 'Expired')}
            className="px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 outline-hidden cursor-pointer"
          >
            <option value="All">All ({myListings.length})</option>
            <option value="Active">Active ({myListings.filter(l => l.status === 'Active').length})</option>
            <option value="Expired">Expired ({myListings.filter(l => l.status === 'Expired').length})</option>
          </select>
        </div>

        <div className="text-xs text-stone-500">
          Showing {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
        </div>
      </div>

      {/* Listing Cards Grid */}
      {filteredListings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-stone-900 text-base mb-1">
            {filterStatus === 'All' ? 'No produce listings yet' : `No ${filterStatus.toLowerCase()} listings`}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Post your harvested batch with your Asking Price and Mandi benchmark hints to start receiving buyer offers.
          </p>
          <button
            id="btn-add-first-listing-cta"
            onClick={() => setActiveTab('add-listing')}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Add Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map(listing => {
            // Count pending offers on this listing
            const offersForThis = negotiations.filter(n => n.listingId === listing.id);
            const activeOffersCount = offersForThis.filter(n => n.status === 'active').length;

            return (
              <div
                key={listing.id}
                id={`listing-card-${listing.id}`}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Photo & Status Badge */}
                  <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={listing.photoUrl}
                      alt={listing.cropName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        id={`badge-status-${listing.id}`}
                        className={`px-3 py-1 text-xs font-bold rounded-full shadow-xs uppercase tracking-wide ${
                          listing.status === 'Active'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-700 text-white'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Harvest: {listing.harvestDate}</span>
                    </div>
                  </div>

                  {/* Listing Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-stone-900 leading-tight">
                        {listing.cropName}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">
                          Asking Price
                        </span>
                        <span className="text-lg font-bold text-emerald-800">
                          ₹{listing.askingPrice} <span className="text-xs text-stone-600">/ {listing.unit}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mb-3">
                      <div>
                        <strong>Quantity:</strong> {listing.quantity} {listing.unit}
                      </div>
                      <div>•</div>
                      <div>
                        <strong>Total Value:</strong> ₹{(listing.askingPrice * listing.quantity).toLocaleString()}
                      </div>
                      <div>•</div>
                      <div className="text-stone-400 font-mono text-[11px]">
                        {listing.postedDate}
                      </div>
                    </div>

                    {listing.notes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 line-clamp-2 italic mb-4">
                        "{listing.notes}"
                      </p>
                    )}

                    {/* Offers Summary Banner */}
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-emerald-950">
                          {offersForThis.length} Total Offers ({activeOffersCount} Active)
                        </span>
                      </div>
                      {activeOffersCount > 0 && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                          Needs Response
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons Bar per specification: Edit, Mark as Expired, Delete Listing, View Offers */}
                <div className="p-5 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-stone-100 mt-2">
                  
                  {/* View Offers Button */}
                  <button
                    id={`btn-view-offers-${listing.id}`}
                    type="button"
                    onClick={() => setViewOffersListing(listing)}
                    className="col-span-2 sm:col-span-1 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>View Offers</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    id={`btn-edit-listing-${listing.id}`}
                    type="button"
                    onClick={() => handleOpenEdit(listing)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Mark as Expired Button */}
                  <button
                    id={`btn-mark-expired-${listing.id}`}
                    type="button"
                    disabled={listing.status === 'Expired'}
                    onClick={() =>
                      openConfirmation({
                        title: 'Mark Listing as Expired?',
                        message: `This will mark ${listing.cropName} as expired and stop new buyer offers. Existing accepted orders will remain valid.`,
                        confirmLabel: 'Mark Expired',
                        isDestructive: false,
                        onConfirm: () => markListingExpired(listing.id)
                      })
                    }
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      listing.status === 'Expired'
                        ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed'
                        : 'bg-stone-100 hover:bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expired</span>
                  </button>

                  {/* Delete Listing Button */}
                  <button
                    id={`btn-delete-listing-${listing.id}`}
                    type="button"
                    onClick={() =>
                      openConfirmation({
                        title: 'Delete Produce Listing?',
                        message: `Are you sure you want to permanently delete your listing for ${listing.cropName}? This action cannot be undone.`,
                        confirmLabel: 'Delete Listing',
                        isDestructive: true,
                        onConfirm: () => deleteListing(listing.id)
                      })
                    }
                    className="px-3 py-2 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Edit Listing: {editingListing.cropName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Asking Price (₹ / {editingListing.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    required
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quantity ({editingListing.unit}) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editQuantity}
                    onChange={e => setEditQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  required
                  value={editHarvestDate}
                  onChange={e => setEditHarvestDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quality Notes
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
