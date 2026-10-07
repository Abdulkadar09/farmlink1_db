import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  FileText,
  Download,
  Calendar,
  User,
  Activity,
  Filter,
  Search
} from 'lucide-react';

export const AdminSystemLogs: React.FC = () => {
  const { auditLogs } = useFarmLink();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export: Button "Export CSV" per specification
  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User ID', 'User Name', 'Role', 'Action', 'Details'];
    const rows = filteredLogs.map(log => [
      log.id,
      `"${log.timestamp}"`,
      log.userId,
      `"${log.userName}"`,
      log.userRole,
      `"${log.action}"`,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `farmlink_system_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header & Export CSV Button per specification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            System Activity Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Immutable chronological ledger of marketplace offers, counter negotiations, order handshakes, and verification events.
          </p>
        </div>

        <button
          id="btn-export-audit-csv"
          type="button"
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by user, action, or details..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white"
          >
            <option value="all">All System Events</option>
            <option value="offer">Offer Made / Received</option>
            <option value="counter">Counter Offers</option>
            <option value="order">Order Pickups & Completion</option>
            <option value="verified">Verification Events</option>
            <option value="listing">Listing Activity</option>
          </select>
        </div>
      </div>

      {/* Chronological Audit Log Table per specification: timestamp, user, action */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User / Actor</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400">
                    No system log entries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="py-3.5 px-6 font-mono text-stone-500 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{log.userName}</span>
                        <span className="text-[10px] font-mono uppercase bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                          {log.userRole}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 font-semibold text-emerald-900">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Activity className="w-3 h-3 text-emerald-700" />
                        <span>{log.action}</span>
                      </span>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-6 text-stone-600 leading-relaxed font-mono text-[11px]">
                      {log.details}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
