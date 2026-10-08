import React from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminListings } from './AdminListings';
import { AdminPriceIndex } from './AdminPriceIndex';
import { AdminDisputes } from './AdminDisputes';
import { AdminSystemLogs } from './AdminSystemLogs';

export const AdminDashboard: React.FC = () => {
  const { activeTab } = useFarmLink();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 pb-16">
      {activeTab === 'overview' && <AdminOverview />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'listings' && <AdminListings />}
      {(activeTab === 'price-index' || activeTab === 'settings') && <AdminPriceIndex />}
      {(activeTab === 'disputes' || activeTab === 'orders-disputes') && <AdminDisputes />}
      {(activeTab === 'logs' || activeTab === 'reports') && <AdminSystemLogs />}
    </div>
  );
};
