import React, { useState, useEffect } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { BuyerSearchDiscover } from './BuyerSearchDiscover';
import { BuyerListingDetail } from './BuyerListingDetail';
import { BuyerNegotiations } from './BuyerNegotiations';
import { BuyerOrders } from './BuyerOrders';
import { BuyerSavedAlerts } from './BuyerSavedAlerts';
import { BuyerNotifications } from './BuyerNotifications';
import { BuyerProfile } from './BuyerProfile';
import { ProduceListing } from '../../types';

export const BuyerDashboard: React.FC = () => {
  const { activeTab, selectedListingId, setSelectedListingId, listings } = useFarmLink();
  const [activeListing, setActiveListing] = useState<ProduceListing | null>(null);

  useEffect(() => {
    if (!selectedListingId) {
      setActiveListing(null);
    } else {
      const found = listings.find(l => l.id === selectedListingId) || null;
      if (found) setActiveListing(found);
    }
  }, [selectedListingId, listings]);

  // If a selectedListingId was passed via notifications
  const effectiveListing = activeListing || (selectedListingId ? listings.find(l => l.id === selectedListingId) || null : null);

  const handleSelectListing = (listing: ProduceListing) => {
    setActiveListing(listing);
    setSelectedListingId(listing.id);
  };

  const handleBackToSearch = () => {
    setActiveListing(null);
    setSelectedListingId(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 pb-16">
      {(activeTab === 'search' || activeTab === 'search-discover') && (
        effectiveListing ? (
          <BuyerListingDetail
            listing={effectiveListing}
            onBack={handleBackToSearch}
          />
        ) : (
          <BuyerSearchDiscover
            onSelectListing={handleSelectListing}
          />
        )
      )}

      {activeTab === 'negotiations' && <BuyerNegotiations />}
      {activeTab === 'orders' && <BuyerOrders />}
      {activeTab === 'alerts' && <BuyerSavedAlerts />}
      {activeTab === 'notifications' && <BuyerNotifications />}
      {activeTab === 'profile' && <BuyerProfile />}
    </div>
  );
};
