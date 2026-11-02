'use client';

import React from 'react';
import { Building2, Plane, Stamp, Bus, Hotel, Users, Settings } from 'lucide-react';
import { ClientRecord, AgencyConfig } from '@/types';

interface AgencyPartnersViewProps {
  clients: ClientRecord[];
  agencyConfig: AgencyConfig;
  onOpenAgencySettings: () => void;
  currencySymbol: string;
}

export default function AgencyPartnersView({
  clients,
  agencyConfig,
  onOpenAgencySettings,
  currencySymbol
}: AgencyPartnersViewProps) {
  // Group clients by partner agencies
  const ticketAgencyClients = clients.filter(c => c.ticketAgencyName === agencyConfig.ticketAgencyName);
  const visaAgencyClients = clients.filter(c => c.visaAgencyName === agencyConfig.visaAgencyName);
  const transportAgencyClients = clients.filter(c => c.transportAgencyName === agencyConfig.transportAgencyName);
  const hotelAgencyClients = clients.filter(c => c.hotelAgencyName === agencyConfig.hotelAgencyName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-wrap">
            <h3 className="card-title">Agency & Supplier Network Overview</h3>
            <span className="card-subtitle">
              Configured partner agencies handling Ticketing, Visas, Transport, and Hotels
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAgencySettings}
          >
            <Settings size={14} />
            <span>Edit Agency Details</span>
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Main Agency */}
            <div className="mini-stat-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <span className="mini-stat-label" style={{ color: '#047857' }}>Primary Travel Agency</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#064e3b', margin: '4px 0' }}>
                {agencyConfig.fullPackageAgencyName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#059669' }}>
                {clients.length} Registered Umrah Packages
              </span>
            </div>

            {/* Ticket Partner */}
            <div className="mini-stat-box">
              <span className="mini-stat-label">Ticketing Supplier</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>
                {agencyConfig.ticketAgencyName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {ticketAgencyClients.length} Flight Allotments
              </span>
            </div>

            {/* Visa Partner */}
            <div className="mini-stat-box">
              <span className="mini-stat-label">Visa Consultancy</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>
                {agencyConfig.visaAgencyName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {visaAgencyClients.length} MoFA Applications
              </span>
            </div>

            {/* Transport Partner */}
            <div className="mini-stat-box">
              <span className="mini-stat-label">Transport Operator</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>
                {agencyConfig.transportAgencyName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {transportAgencyClients.length} Vehicle Bookings
              </span>
            </div>

            {/* Hotel Supplier */}
            <div className="mini-stat-box">
              <span className="mini-stat-label">Hotel Hospitality Partner</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>
                {agencyConfig.hotelAgencyName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {hotelAgencyClients.length} Room Allotments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown per Agency Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-wrap">
            <h3 className="card-title">Pilgrim Bookings Grouped by Agency Partners</h3>
            <span className="card-subtitle">Track supplier involvement for each client</span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Pilgrim Name</th>
                  <th>Travel Agency</th>
                  <th>Ticket Agency</th>
                  <th>Visa Agency</th>
                  <th>Transport Agency</th>
                  <th>Hotel Agency</th>
                  <th className="text-right">Total Package</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id || c.serialNo}>
                    <td style={{ fontWeight: 700, color: '#047857' }}>#{c.serialNo}</td>
                    <td>
                      <strong>{c.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                        Passport: {c.passport}
                      </span>
                    </td>
                    <td>{c.fullPackageAgencyName}</td>
                    <td>{c.ticketAgencyName}</td>
                    <td>{c.visaAgencyName}</td>
                    <td>{c.transportAgencyName}</td>
                    <td>{c.hotelAgencyName}</td>
                    <td className="text-right" style={{ fontWeight: 700 }}>
                      {currencySymbol} {(Number(c.totalAmount) || 0).toLocaleString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
