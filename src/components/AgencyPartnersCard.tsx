'use client';

import React from 'react';
import { Plane, Stamp, Bus, Hotel } from 'lucide-react';
import { ClientRecord, AgencyConfig } from '@/types';

interface AgencyPartnersCardProps {
  clients: ClientRecord[];
  agencyConfig: AgencyConfig;
  onManageAgencies: () => void;
}

export default function AgencyPartnersCard({
  clients,
  agencyConfig,
  onManageAgencies
}: AgencyPartnersCardProps) {
  // Aggregate partner agencies from active clients
  const ticketAgencies = new Set(clients.map(c => c.ticketAgencyName).filter(Boolean));
  const visaAgencies = new Set(clients.map(c => c.visaAgencyName).filter(Boolean));
  const transportAgencies = new Set(clients.map(c => c.transportAgencyName).filter(Boolean));
  const hotelAgencies = new Set(clients.map(c => c.hotelAgencyName).filter(Boolean));

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <h3 className="card-title">Agency & Service Partners</h3>
          <span className="card-subtitle">Ticketing, Visa, Transport & Hotel suppliers</span>
        </div>
        <button 
          type="button" 
          className="btn btn-sm btn-outline"
          onClick={onManageAgencies}
        >
          Manage Agencies
        </button>
      </div>

      <div className="card-body">
        <div className="agency-network-list">
          {/* Ticket Agency */}
          <div className="agency-item-card">
            <div className="agency-item-left">
              <span className="agency-type-tag tag-ticket">Ticket</span>
              <div>
                <span className="agency-name-text">
                  {agencyConfig.ticketAgencyName || 'Al-Haramain Aviation'}
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                  Aviation & Airlines Partner
                </span>
              </div>
            </div>
            <span className="agency-item-count">
              {clients.filter(c => c.ticketAgencyName === agencyConfig.ticketAgencyName).length} Bookings
            </span>
          </div>

          {/* Visa Agency */}
          <div className="agency-item-card">
            <div className="agency-item-left">
              <span className="agency-type-tag tag-visa">Visa</span>
              <div>
                <span className="agency-name-text">
                  {agencyConfig.visaAgencyName || 'Bab-e-Mecca Visa Consultants'}
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                  MoFA eVisa Processing
                </span>
              </div>
            </div>
            <span className="agency-item-count">
              {clients.filter(c => c.visaAgencyName === agencyConfig.visaAgencyName).length} Visas
            </span>
          </div>

          {/* Transport Agency */}
          <div className="agency-item-card">
            <div className="agency-item-left">
              <span className="agency-type-tag tag-transport">Transport</span>
              <div>
                <span className="agency-name-text">
                  {agencyConfig.transportAgencyName || 'Saptco VIP & Al-Wissam Transport'}
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                  KSA Ground Fleet (GMC/Bus/Car)
                </span>
              </div>
            </div>
            <span className="agency-item-count">
              {clients.filter(c => c.transportAgencyName === agencyConfig.transportAgencyName).length} Transfers
            </span>
          </div>

          {/* Hotel Agency */}
          <div className="agency-item-card">
            <div className="agency-item-left">
              <span className="agency-type-tag tag-hotel">Hotel</span>
              <div>
                <span className="agency-name-text">
                  {agencyConfig.hotelAgencyName || 'Al-Rawda Hospitality Group'}
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                  Makkah & Madinah B2B Allotments
                </span>
              </div>
            </div>
            <span className="agency-item-count">
              {clients.filter(c => c.hotelAgencyName === agencyConfig.hotelAgencyName).length} Rooms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
