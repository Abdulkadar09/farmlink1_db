import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { ProduceListing } from '../../types';
import {
  Search,
  Filter,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  Handshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Building2,
  UserCheck
} from 'lucide-react';

interface BuyerSearchDiscoverProps {
  onSelectListing: (listing: ProduceListing) => void;
}

export const BuyerSearchDiscover: React.FC<BuyerSearchDiscoverProps> = ({ onSelectListing }) => {
  const { listings, createOffer, openMapModal } = useFarmLink();

  // Search and Mode state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'crop-search' | 'nearby-farms'>('crop-search');

  // Filter panel states per specification
  const [radiusKm, setRadiusKm] = useState<number>(10); // 10km default
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [freshnessDays, setFreshnessDays] = useState<string>('all'); // all | 3days | 7days
  const [minQuantity, setMinQuantity] = useState<number | ''>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all'); // district placeholder-only per spec

  // Filter drawer toggle on mobile
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Quick Make an Offer modal state
  const [quickOfferListing, setQuickOfferListing] = useState<ProduceListing | null>(null);
  const [quickOfferPrice, setQuickOfferPrice] = useState<number | ''>('');
  const [quickOfferQty, setQuickOfferQty] = useState<number | ''>('');
  const [quickOfferSuccess, setQuickOfferSuccess] = useState(false);

  // Active filter applied trigger
  const [appliedFilters, setAppliedFilters] = useState({
    radiusKm: 10,
    maxPrice: 200,
    freshnessDays: 'all',
    minQuantity: '' as number | ''
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      radiusKm,
      maxPrice,
      freshnessDays,
      minQuantity
    });
    setShowFilterDrawer(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRadiusKm(10);
    setMaxPrice(200);
    setFreshnessDays('all');
    setMinQuantity('');
    setDistrictFilter('all');
    setAppliedFilters({
      radiusKm: 10,
      maxPrice: 200,
      freshnessDays: 'all',
      minQuantity: ''
    });
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      // Must be active
      if (l.status !== 'Active') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCrop = l.cropName.toLowerCase().includes(q);
        const matchesFarmer = l.farmerName.toLowerCase().includes(q);
        if (!matchesCrop && !matchesFarmer) return false;
      }

      // Radius
      if (l.distanceKm > appliedFilters.radiusKm) return false;

      // Price slider
      if (l.askingPrice > appliedFilters.maxPrice) return false;

      // Min quantity
      if (appliedFilters.minQuantity && l.quantity < appliedFilters.minQuantity) {
        return false;
      }

      return true;
    });
  }, [listings, searchQuery, appliedFilters]);

  // Group listings by farm for "Browse Nearby Farms" toggle
  const nearbyFarms = useMemo(() => {
    const farmMap: { [farmerName: string]: { farmer: string; rating: number; distance: number; address: string; phone: string; coords: { lat: number; lng: number }; crops: ProduceListing[] } } = {};
    listings.forEach(l => {
      if (l.status !== 'Active') return;
      if (!farmMap[l.farmerName]) {
        farmMap[l.farmerName] = {
          farmer: l.farmerName,
          rating: l.farmerRating,
          distance: l.distanceKm,
          address: l.farmAddress,
          phone: l.farmerPhone,
          coords: l.coordinates,
          crops: []
        };
      }
      farmMap[l.farmerName].crops.push(l);
    });
    return Object.values(farmMap);
  }, [listings]);

  const handleOpenQuickOffer = (listing: ProduceListing) => {
    setQuickOfferListing(listing);
    setQuickOfferPrice(listing.askingPrice);
    setQuickOfferQty(Math.min(50, listing.quantity));
    setQuickOfferSuccess(false);
  };

  const handleSendQuickOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickOfferListing || !quickOfferPrice || !quickOfferQty) return;
    createOffer(quickOfferListing.id, Number(quickOfferPrice), Number(quickOfferQty));
    setQuickOfferSuccess(true);
    setTimeout(() => {
      setQuickOfferListing(null);
      setQuickOfferSuccess(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header & Tagline */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Search & Discover Harvests
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Browse direct farm listings by radius and negotiate asking prices directly with growers.
        </p>
      </div>

      {/* Main Search Bar per specification */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
          <input
            id="search-crop-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search crop (e.g., Tomatoes, Onions, Wheat, Cauliflower)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden bg-stone-50/50"
          />
        </div>

        {/* Toggle/Tab within page: "Crop Search" vs "Browse Nearby Farms" per spec */}
        <div className="flex rounded-xl bg-stone-100 p-1 shrink-0 w-full sm:w-auto">
          <button
            id="toggle-crop-search"
            type="button"
            onClick={() => setActiveSubTab('crop-search')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'crop-search' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            🌾 Crop Search
          </button>
          <button
            id="toggle-nearby-farms"
            type="button"
            onClick={() => setActiveSubTab('nearby-farms')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'nearby-farms' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            🚜 Browse Nearby Farms
          </button>
        </div>

        <button
          id="btn-toggle-filter-mobile"
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="sm:hidden w-full py-2.5 px-4 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 flex items-center justify-center gap-2"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters ({appliedFilters.radiusKm}km radius)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filter Panel (Desktop sidebar / Mobile drawer) */}
        <div className={`lg:col-span-3 ${showFilterDrawer ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Filter Criteria
                </h3>
              </div>
              <button
                id="btn-reset-filters"
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Dropdown: Distance radius (10km default, district as placeholder-only) per spec */}
            <div>
              <label htmlFor="select-radius-dropdown" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Distance Radius: <span className="text-emerald-800 font-bold">{radiusKm} km</span>
              </label>
              <select
                id="select-radius-dropdown"
                value={radiusKm}
                onChange={e => setRadiusKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 bg-white"
              >
                <option value={5}>Within 5 km (Immediate Farm Belt)</option>
                <option value={10}>Within 10 km (Default Mandi Zone)</option>
                <option value={25}>Within 25 km (Regional Growers)</option>
                <option value={50}>Within 50 km (Expanded District)</option>
              </select>
            </div>

            {/* District placeholder-only per spec */}
            <div>
              <label htmlFor="select-district-placeholder" className="block text-xs font-semibold text-stone-700 mb-1.5">
                District / Tehsil (Placeholder Only)
              </label>
              <select
                id="select-district-placeholder"
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 text-stone-500"
              >
                <option value="all">All Nearby Districts (Auto-GPS)</option>
                <option value="pune">Pune District</option>
                <option value="nashik">Nashik Agricultural Division</option>
                <option value="karnal">Karnal GT Belt</option>
              </select>
              <span className="text-[10px] text-stone-400 mt-0.5 block">GPS radius active by default.</span>
            </div>

            {/* Range slider: Price range per spec */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Max Asking Price:</span>
                <span className="text-emerald-800 font-bold">₹{maxPrice} / unit</span>
              </div>
              <input
                id="slider-price-range"
                type="range"
                min={10}
                max={500}
                step={5}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>₹10</span>
                <span>₹250</span>
                <span>₹500</span>
              </div>
            </div>

            {/* Date filter: Harvest/listing freshness per spec */}
            <div>
              <label htmlFor="select-freshness-filter" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Harvest Freshness
              </label>
              <select
                id="select-freshness-filter"
                value={freshnessDays}
                onChange={e => setFreshnessDays(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 bg-white"
              >
                <option value="all">Any Harvest Date</option>
                <option value="today">Harvested Today</option>
                <option value="3days">Within Last 3 Days</option>
                <option value="7days">Within Last 7 Days</option>
              </select>
            </div>

            {/* Input: Minimum quantity needed per spec */}
            <div>
              <label htmlFor="input-min-quantity" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Minimum Quantity Needed
              </label>
              <input
                id="input-min-quantity"
                type="number"
                min={1}
                value={minQuantity}
                onChange={e => setMinQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 100 kg"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
              />
            </div>

            {/* Buttons: Apply Filters & Reset Filters */}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <button
                id="btn-apply-filters"
                type="button"
                onClick={handleApplyFilters}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                id="btn-reset-filters-secondary"
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-9">
          
          {/* Sub-tab 1: Crop Search Results */}
          {activeSubTab === 'crop-search' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Available Produce Batches ({filteredListings.length})
                </span>
                <span className="text-xs text-stone-500">
                  Radius: <strong>{appliedFilters.radiusKm} km</strong>
                </span>
              </div>

              {filteredListings.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
                  <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-stone-800 text-sm mb-1">No Produce Matches</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                    Try widening your distance radius or clearing quantity filters to see more farm listings.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map(listing => (
                    /* Listing Card per specification: Farm photo, Crop name, Asking Price/unit, Distance, Farmer rating (stars), Listing freshness */
                    <div
                      key={listing.id}
                      id={`buyer-listing-card-${listing.id}`}
                      className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Farm Photo */}
                        <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                          <img
                            src={listing.photoUrl}
                            alt={listing.cropName}
                            className="w-full h-full object-cover"
                          />
                          {/* Distance */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{listing.distanceKm} km</span>
                          </div>

                          {/* Listing freshness ("Posted 2 days ago") per spec */}
                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-medium text-stone-700 shadow-xs">
                            {listing.postedDate}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <h3 className="font-bold text-stone-900 text-base leading-tight">
                              {listing.cropName}
                            </h3>
                          </div>

                          {/* Farmer name + Star rating */}
                          <div className="flex items-center gap-2 text-xs text-stone-600 mb-3">
                            <span className="font-semibold text-stone-800">{listing.farmerName}</span>
                            <span>•</span>
                            <div className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{listing.farmerRating}</span>
                            </div>
                          </div>

                          {/* Asking Price per unit */}
                          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                                Asking Price
                              </span>
                              <div className="text-base font-bold text-emerald-800">
                                ₹{listing.askingPrice} <span className="text-xs text-stone-600 font-medium">/ {listing.unit}</span>
                              </div>
                            </div>
                            <div className="text-right text-xs text-stone-600">
                              <span className="text-[10px] text-stone-400 block">Available</span>
                              <span className="font-semibold">{listing.quantity} {listing.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons per specification: "View Details" & "Make an Offer" */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2 border-t border-stone-100">
                        <button
                          id={`btn-view-details-${listing.id}`}
                          type="button"
                          onClick={() => onSelectListing(listing)}
                          className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          id={`btn-quick-make-offer-${listing.id}`}
                          type="button"
                          onClick={() => handleOpenQuickOffer(listing)}
                          className="px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Make an Offer</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 2: Browse Nearby Farms */}
          {activeSubTab === 'nearby-farms' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Nearby Verified Growers ({nearbyFarms.length})
                </span>
                <span className="text-xs text-stone-500">
                  Direct farm gates within radius
                </span>
              </div>

              <div className="space-y-4">
                {nearbyFarms.map(farm => (
                  <div
                    key={farm.farmer}
                    className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                          {farm.farmer.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-stone-900">{farm.farmer}</h3>
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <UserCheck className="w-3 h-3" /> Verified Grower
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <div className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{farm.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{farm.distance} km away</span>
                            <span>•</span>
                            <span>{farm.crops.length} active listings</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openMapModal({
                            title: `${farm.farmer}'s Farm Location`,
                            coordinates: farm.coords,
                            address: farm.address
                          })
                        }
                        className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>View Farm on Map</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-stone-100">
                      <span className="text-[11px] font-bold uppercase text-stone-400 block mb-2">
                        Currently Available Harvests:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {farm.crops.map(c => (
                          <div
                            key={c.id}
                            className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-stone-800">{c.cropName}</div>
                              <div className="text-[11px] text-stone-500">
                                ₹{c.askingPrice}/{c.unit} • {c.quantity} {c.unit}
                              </div>
                            </div>
                            <button
                              onClick={() => onSelectListing(c)}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white rounded-lg border border-stone-200 shadow-2xs"
                            >
                              Offer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Quick "Make an Offer" Modal per specification */}
      {quickOfferListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Quick Offer: {quickOfferListing.cropName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickOfferListing(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quickOfferSuccess ? (
              <div className="p-8 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  Offer Sent to Farmer {quickOfferListing.farmerName}!
                </h4>
                <p className="text-xs text-stone-500">
                  Round 1 negotiation registered. Track status under My Negotiations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuickOffer} className="p-6 space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between">
                  <span>Farmer's Asking Price:</span>
                  <span className="font-bold text-stone-800">₹{quickOfferListing.askingPrice} / {quickOfferListing.unit}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Offer (₹ / {quickOfferListing.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    required
                    value={quickOfferPrice}
                    onChange={e => setQuickOfferPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quantity Needed ({quickOfferListing.unit}) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={quickOfferListing.quantity}
                    required
                    value={quickOfferQty}
                    onChange={e => setQuickOfferQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-stone-300"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Available: {quickOfferListing.quantity} {quickOfferListing.unit}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setQuickOfferListing(null)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Offer</span>
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
