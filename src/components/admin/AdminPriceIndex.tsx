import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { CropMaster } from '../../types';
import {
  TrendingUp,
  Plus,
  RefreshCw,
  Edit2,
  Save,
  X,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const AdminPriceIndex: React.FC = () => {
  const { crops, updateCropMandiPrice, addNewCrop, refreshMandiPrices } = useFarmLink();

  // Modal: Update Price
  const [editingCrop, setEditingCrop] = useState<CropMaster | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  // Modal: Add New Crop per spec
  const [showAddModal, setShowAddModal] = useState(false);
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<'Vegetable' | 'Grain' | 'Fruit' | 'Pulse' | 'Oilseed'>('Vegetable');
  const [baseUnit, setBaseUnit] = useState('kg');
  const [defaultPrice, setDefaultPrice] = useState<number | ''>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [syncFeedback, setSyncFeedback] = useState(false);

  const handleOpenUpdate = (crop: CropMaster) => {
    setEditingCrop(crop);
    setNewPrice(crop.mandiPrice);
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop || !newPrice) return;
    updateCropMandiPrice(editingCrop.id, Number(newPrice));
    setEditingCrop(null);
  };

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !defaultPrice) return;

    addNewCrop({
      name: cropName.trim(),
      category,
      baseUnit,
      mandiPrice: Number(defaultPrice),
      mandiPriceRange: {
        min: minPrice ? Number(minPrice) : Number(defaultPrice) * 0.9,
        max: maxPrice ? Number(maxPrice) : Number(defaultPrice) * 1.15
      }
    });

    setShowAddModal(false);
    setCropName('');
    setDefaultPrice('');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleTriggerSync = () => {
    refreshMandiPrices();
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Header & Actions per specification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            APMC Mandi Price Index Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Control the official benchmark prices used to guide farmer Asking Prices and buyer negotiation expectations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          
          {/* Button: "Refresh All from Mandi API" */}
          <button
            id="btn-refresh-all-mandi-api"
            type="button"
            onClick={handleTriggerSync}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
            <span>Refresh All from Mandi API</span>
          </button>

          {/* Button: "Add New Crop" */}
          <button
            id="btn-add-new-crop"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Crop</span>
          </button>

        </div>
      </div>

      {syncFeedback && (
        <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Successfully synchronized APMC Mandi price tickers across all commodities.
        </div>
      )}

      {/* Table: Crop Name, Mandi Price, Unit, Last Updated per specification */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Crop Name</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Mandi Benchmark Price</th>
                <th className="py-3.5 px-6">Expected Range</th>
                <th className="py-3.5 px-6">Standard Unit</th>
                <th className="py-3.5 px-6">Last Updated</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {crops.map(crop => (
                <tr key={crop.id} className="hover:bg-stone-50/70 transition-colors">
                  
                  {/* Crop Name */}
                  <td className="py-4 px-6 font-bold text-stone-900">
                    {crop.name}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                      {crop.category}
                    </span>
                  </td>

                  {/* Mandi Price */}
                  <td className="py-4 px-6 font-bold text-emerald-800 text-sm">
                    ₹{crop.mandiPrice} <span className="text-xs font-normal text-stone-500">/ {crop.baseUnit}</span>
                  </td>

                  {/* Expected Range */}
                  <td className="py-4 px-6 text-stone-500 font-mono text-[11px]">
                    ₹{crop.mandiPriceRange.min} - ₹{crop.mandiPriceRange.max}
                  </td>

                  {/* Standard Unit */}
                  <td className="py-4 px-6 font-mono text-stone-600">
                    {crop.baseUnit}
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 px-6 text-stone-400 font-mono text-[11px]">
                    {crop.lastUpdated}
                  </td>

                  {/* Action: Button "Update Price" per specification */}
                  <td className="py-4 px-6 text-right">
                    <button
                      id={`btn-update-crop-price-${crop.id}`}
                      type="button"
                      onClick={() => handleOpenUpdate(crop)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-stone-500" />
                      <span>Update Price</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Price Modal per specification */}
      {editingCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Update Mandi Benchmark: {editingCrop.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCrop(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New APMC Mandi Benchmark Price (₹ / {editingCrop.baseUnit}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-base font-bold"
                  />
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Current benchmark: ₹{editingCrop.mandiPrice} / {editingCrop.baseUnit}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingCrop(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Benchmark</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Crop Modal (form: crop name, unit, default price) per specification */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Add Crop to Mandi Price Master</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCropSubmit} className="p-6 space-y-4">
              
              {/* Crop Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={e => setCropName(e.target.value)}
                  placeholder="e.g. Ginger (Fresh Rhizome)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Vegetable">Vegetable</option>
                  <option value="Grain">Grain</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Pulse">Pulse</option>
                  <option value="Oilseed">Oilseed</option>
                </select>
              </div>

              {/* Standard Unit */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Base Trading Unit *
                </label>
                <select
                  value={baseUnit}
                  onChange={e => setBaseUnit(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="crate">crate</option>
                  <option value="dozen">dozen</option>
                </select>
              </div>

              {/* Default Price */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Default Benchmark Price (₹ / {baseUnit}) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  required
                  value={defaultPrice}
                  onChange={e => setDefaultPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 45.00"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Min Range (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Optional"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Max Range (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Optional"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Add Commodity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
