import React from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmationModal, closeConfirmation } = useFarmLink();

  if (!confirmationModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="confirmation-modal-dialog"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${confirmationModal.isDestructive ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              id="btn-close-confirmation-x"
              onClick={closeConfirmation}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            {confirmationModal.title}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            {confirmationModal.message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
            <button
              id="btn-cancel-confirmation"
              type="button"
              onClick={closeConfirmation}
              className="px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              {confirmationModal.cancelLabel || 'Cancel'}
            </button>
            <button
              id="btn-confirm-action"
              type="button"
              onClick={() => {
                confirmationModal.onConfirm();
                closeConfirmation();
              }}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-xs transition-colors cursor-pointer ${
                confirmationModal.isDestructive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {confirmationModal.confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
