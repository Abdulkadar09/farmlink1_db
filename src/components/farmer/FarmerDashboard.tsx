import React from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { FarmerAddListing } from './FarmerAddListing';
import { FarmerMyListings } from './FarmerMyListings';
import { FarmerNotifications } from './FarmerNotifications';
import { FarmerProfile } from './FarmerProfile';

export const FarmerDashboard: React.FC = () => {
  const { activeTab } = useFarmLink();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 pb-16">
      {activeTab === 'add-listing' && <FarmerAddListing />}
      {activeTab === 'my-listings' && <FarmerMyListings />}
      {activeTab === 'notifications' && <FarmerNotifications />}
      {activeTab === 'profile' && <FarmerProfile />}
    </div>
  );
};
