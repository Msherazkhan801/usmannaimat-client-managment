'use client';

import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Edit3, 
  Trash2, 
  FileSpreadsheet, 
  Phone, 
  Calendar, 
  MapPin, 
  Hotel, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import { ClientRecord } from '@/types';

interface ClientTableProps {
  clients: ClientRecord[];
  currencySymbol: string;
  onEditClient: (client: ClientRecord) => void;
  onDeleteClient: (id: string) => void;
  onViewVoucher: (client: ClientRecord) => void;
  onOpenAddClient: () => void;
  onExportCsv: () => void;
}

export default function ClientTable({
  clients,
  currencySymbol,
  onEditClient,
  onDeleteClient,
  onViewVoucher,
  onOpenAddClient,
  onExportCsv
}: ClientTableProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'saudi' | 'upcoming'>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedVisa, setSelectedVisa] = useState<string>('');

  // Counts for tabs
  const countAll = clients.length;
  const countPending = clients.filter(c => (Number(c.clearBalance) || 0) > 0).length;
  const countPaid = clients.filter(c => (Number(c.clearBalance) || 0) <= 0 && (Number(c.totalAmount) || 0) > 0).length;
  const countInSaudi = clients.filter(c => c.travelStatus === 'In Makkah' || c.travelStatus === 'In Madinah').length;
  const countUpcoming = clients.filter(c => c.travelStatus === 'Upcoming').length;

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      // Tab filter
      if (activeTab === 'pending' && (Number(c.clearBalance) || 0) <= 0) return false;
      if (activeTab === 'paid' && (Number(c.clearBalance) || 0) > 0) return false;
      if (activeTab === 'saudi' && c.travelStatus !== 'In Makkah' && c.travelStatus !== 'In Madinah') return false;
      if (activeTab === 'upcoming' && c.travelStatus !== 'Upcoming') return false;

      // Dropdown filters
      if (selectedRoom && c.roomType !== selectedRoom) return false;
      if (selectedVisa && c.visaType !== selectedVisa) return false;

      return true;
    });
  }, [clients, activeTab, selectedRoom, selectedVisa]);

  const formatMoney = (val: number) => {
    return `${currencySymbol} ${(Number(val) || 0).toLocaleString('en-US')}`;
  };

  return (
    <div className="card table-card">
      <div className="card-header">
        <div className="card-title-wrap">
          <h3 className="card-title">Registered Umrah Bookings & Pilgrims</h3>
          <span className="card-subtitle">
            Complete database of client identity, hotel allocations, partner agencies & balance dues
          </span>
        </div>
        <div className="card-actions">
          <button 
            type="button" 
            className="btn btn-sm btn-outline"
            onClick={onExportCsv}
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
          <button 
            type="button" 
            className="btn btn-sm btn-primary"
            onClick={onOpenAddClient}
          >
            + Add Client
          </button>
        </div>
      </div>

      {/* Filter Tabs & Dropdowns */}
      <div className="table-filter-bar">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({countAll})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Balance Due ({countPending})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            Fully Cleared ({countPaid})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeTab === 'saudi' ? 'active' : ''}`}
            onClick={() => setActiveTab('saudi')}
          >
            In Saudi Arabia ({countInSaudi})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({countUpcoming})
          </button>
        </div>

        <div className="filter-dropdowns">
          <select 
            className="select-filter"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">All Rooms</option>
            <option value="Sharing">Sharing</option>
            <option value="Quad">Quad (4 Bed)</option>
            <option value="Triple">Triple (3 Bed)</option>
            <option value="Double">Double (2 Bed)</option>
            <option value="Single">Single</option>
          </select>

          <select 
            className="select-filter"
            value={selectedVisa}
            onChange={(e) => setSelectedVisa(e.target.value)}
          >
            <option value="">All Visas</option>
            <option value="Umrah eVisa">Umrah eVisa</option>
            <option value="Tourist eVisa">Tourist eVisa</option>
            <option value="Transit / Stopover">Transit</option>
            <option value="Family Visit">Family Visit</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-sno">S.No</th>
              <th className="col-client">Client / Pilgrim</th>
              <th className="col-contact">Contact & ID</th>
              <th className="col-passport">Passport</th>
              <th className="col-travel">Travel Schedule</th>
              <th className="col-hotels">Hotels & Stays</th>
              <th className="col-package">Room & Meals</th>
              <th className="col-visa">Visa & Transport</th>
              <th className="col-agencies">Agency Partners</th>
              <th className="col-finance text-right">Financials (Total / Recv / Balance)</th>
              <th className="col-status text-center">Status</th>
              <th className="col-actions text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const balance = Number(client.clearBalance) || 0;
              const isCleared = balance <= 0;

              return (
                <tr key={client.id || client.serialNo}>
                  {/* S.No */}
                  <td className="col-sno">#{client.serialNo}</td>

                  {/* Pilgrim Name */}
                  <td className="col-client">
                    <div className="client-name-cell">
                      <span className="client-full-name">{client.name}</span>
                      <span className="client-relation">
                        S/O, D/O, W/O: <b>{client.fatherOrHusbandName}</b>
                      </span>
                    </div>
                  </td>

                  {/* Contact & CNIC */}
                  <td className="col-contact">
                    <div className="contact-cell">
                      <span className="contact-phone">
                        <Phone size={12} />
                        {client.mobileNumber}
                      </span>
                      <span className="contact-cnic">ID: {client.idCard}</span>
                    </div>
                  </td>

                  {/* Passport */}
                  <td className="col-passport">{client.passport}</td>

                  {/* Travel Dates & Days */}
                  <td className="col-travel">
                    <div className="travel-dates-cell">
                      <span className="travel-range">
                        {client.travelDateIn} &rarr; {client.travelDateOut}
                      </span>
                      <span className="travel-meta">
                        {client.days} Days &bull; {client.airline}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {client.airportIn} to {client.airportOut}
                      </span>
                    </div>
                  </td>

                  {/* Hotels & Stays */}
                  <td className="col-hotels">
                    <div className="hotel-stay-cell">
                      <span className="hotel-pill makkah">
                        Makkah: {client.makkahStay}
                      </span>
                      <span className="hotel-pill madinah">
                        Madinah: {client.medinahStay}
                      </span>
                    </div>
                  </td>

                  {/* Room & Meals */}
                  <td className="col-package">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>
                        {client.roomType} Room
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                        {client.mealPlan}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#047857' }}>
                        Ziyarat: {client.ziyarat}
                      </span>
                    </div>
                  </td>

                  {/* Visa & Transport */}
                  <td className="col-visa">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {client.visaType}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        App: {client.applicationNumber || 'Pending'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#7c3aed' }}>
                        {client.transportType}
                      </span>
                    </div>
                  </td>

                  {/* Agency Partners */}
                  <td className="col-agencies">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.73rem' }}>
                      <span><strong>Agency:</strong> {client.fullPackageAgencyName}</span>
                      <span><strong>Ticket:</strong> {client.ticketAgencyName}</span>
                      <span><strong>Hotel:</strong> {client.hotelAgencyName}</span>
                    </div>
                  </td>

                  {/* Financials */}
                  <td className="col-finance text-right">
                    <div className="finance-cell">
                      <span className="finance-total">Total: {formatMoney(client.totalAmount)}</span>
                      <span className="finance-received">Recv: {formatMoney(client.received)}</span>
                      <span className={`finance-balance ${isCleared ? 'cleared' : 'due'}`}>
                        Bal: {formatMoney(client.clearBalance)}
                      </span>
                    </div>
                  </td>

                  {/* Payment Status Badge */}
                  <td className="col-status text-center">
                    <span className={`badge ${isCleared ? 'badge-success' : 'badge-danger'}`}>
                      {isCleared ? 'Cleared' : 'Due Balance'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="col-actions text-center">
                    <div className="action-btn-group">
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => onViewVoucher(client)}
                        title="Generate & Print Official Umrah Voucher / Invoice"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => onEditClient(client)}
                        title="Edit Client Information"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn btn-delete"
                        onClick={() => onDeleteClient(client.id || '')}
                        title="Delete Client Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Compass size={28} />
            </div>
            <h4 className="empty-title">No client records found</h4>
            <p className="empty-desc">
              No pilgrims match your current filter settings. Click below to add a new Umrah client record.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAddClient}
            >
              + Add Umrah Client
            </button>
          </div>
        )}
      </div>

      <div className="table-footer">
        <span className="table-info">
          Showing {filteredClients.length} of {clients.length} registered clients
        </span>
      </div>
    </div>
  );
}
