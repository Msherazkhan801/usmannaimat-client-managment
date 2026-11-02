'use client';

import React from 'react';
import { Printer, X } from 'lucide-react';
import { ClientRecord, AgencyConfig } from '@/types';

interface PrintableVoucherModalProps {
  client: ClientRecord | null;
  agencyConfig: AgencyConfig;
  currencySymbol: string;
  onClose: () => void;
}

export default function PrintableVoucherModal({
  client,
  agencyConfig,
  currencySymbol,
  onClose
}: PrintableVoucherModalProps) {
  if (!client) return null;

  const handlePrint = () => {
    window.print();
  };

  const netPayable = (Number(client.totalAmount) || 0) - (Number(client.discount) || 0);
  const balance = Number(client.clearBalance) || 0;
  const isCleared = balance <= 0;

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">Official Umrah Booking Voucher & Invoice</h3>
            <p className="modal-subtitle">Print-ready confirmation document with complete itinerary & accounts</p>
          </div>
          <div className="modal-header-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Print Voucher</span>
            </button>
            <button type="button" className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body p-0">
          <div className="voucher-document" id="printableVoucher">
            {/* Header */}
            <div className="voucher-header">
              <div className="voucher-agency-info">
                <div style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.2rem', color: '#b45309', fontWeight: 700 }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <h2>{client.fullPackageAgencyName || agencyConfig.fullPackageAgencyName}</h2>
                <p>{agencyConfig.address || 'Umrah & Hajj Services | Authorized Ministry of Hajj & Umrah Partner'}</p>
                <p>Phone: {agencyConfig.contactNumber || '+92 300 8472910'} &bull; Email: {agencyConfig.email || 'info@usmantravel.com'}</p>
              </div>
              <div className="voucher-title-tag">
                <span className="v-tag">UMRAH VOUCHER</span>
                <div className="voucher-serial">File #{client.serialNo}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Pilgrim & Flight Info (2 Column) */}
            <div className="voucher-grid-2">
              {/* Pilgrim Details */}
              <div className="voucher-box">
                <div className="voucher-box-title">
                  <span>Pilgrim Identification</span>
                  <span style={{ fontSize: '0.7rem', color: '#047857' }}>Primary Traveler</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Full Name:</span>
                  <span className="v-val">{client.name}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Father / Husband:</span>
                  <span className="v-val">{client.fatherOrHusbandName}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Mobile / WhatsApp:</span>
                  <span className="v-val">{client.mobileNumber}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">National ID (CNIC):</span>
                  <span className="v-val">{client.idCard}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Passport Number:</span>
                  <span className="v-val" style={{ fontFamily: 'monospace' }}>{client.passport}</span>
                </div>
              </div>

              {/* Flight Itinerary */}
              <div className="voucher-box">
                <div className="voucher-box-title">
                  <span>Flight & Route Schedule</span>
                  <span style={{ fontSize: '0.7rem', color: '#0284c7' }}>{client.days} Days Tour</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Departure Date (IN):</span>
                  <span className="v-val">{client.travelDateIn}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Return Date (OUT):</span>
                  <span className="v-val">{client.travelDateOut}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Airline:</span>
                  <span className="v-val">{client.airline}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Airport Route:</span>
                  <span className="v-val">{client.airportIn} &rarr; {client.airportOut}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Ticketing Agency:</span>
                  <span className="v-val">{client.ticketAgencyName}</span>
                </div>
              </div>
            </div>

            {/* Accommodation Table */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#064e3b', marginBottom: '6px' }}>
                HOTEL ACCOMMODATION & GROUND SERVICES
              </div>
              <table className="voucher-hotels-table">
                <thead>
                  <tr>
                    <th>City / Holy Site</th>
                    <th>Hotel & Nights Details</th>
                    <th>Room Type</th>
                    <th>Meal Plan</th>
                    <th>Hotel Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Holy Makkah</strong></td>
                    <td>{client.makkahStay}</td>
                    <td>{client.roomType}</td>
                    <td>{client.mealPlan}</td>
                    <td>{client.hotelAgencyName}</td>
                  </tr>
                  <tr>
                    <td><strong>Al-Madinah Al-Munawwarah</strong></td>
                    <td>{client.medinahStay}</td>
                    <td>{client.roomType}</td>
                    <td>{client.mealPlan}</td>
                    <td>{client.hotelAgencyName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visa & Transport Breakdown */}
            <div className="voucher-grid-2" style={{ marginTop: '14px' }}>
              <div className="voucher-box">
                <div className="voucher-box-title">
                  <span>Visa Credentials</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Visa Type:</span>
                  <span className="v-val">{client.visaType}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Visa Number:</span>
                  <span className="v-val">{client.visaNumber || 'Issued on arrival/e-portal'}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">MoFA Application #:</span>
                  <span className="v-val">{client.applicationNumber || 'N/A'}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Visa Agency:</span>
                  <span className="v-val">{client.visaAgencyName}</span>
                </div>
              </div>

              <div className="voucher-box">
                <div className="voucher-box-title">
                  <span>Transport & Ziyarat Plan</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Transport Type:</span>
                  <span className="v-val">{client.transportType}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Transport Agency:</span>
                  <span className="v-val">{client.transportAgencyName}</span>
                </div>
                <div className="v-item">
                  <span className="v-label">Holy Ziyarat:</span>
                  <span className="v-val">{client.ziyarat}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger & Balance Summary */}
            <div className="voucher-financial-summary">
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  PAYMENT TERMS & BOOKING NOTES
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {client.notes || 'All bookings are confirmed subject to Ministry of Hajj & Umrah guidelines. Hotel check-in time 16:00, check-out time 12:00.'}
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.78rem' }}>
                  <strong>Payment Status: </strong>
                  <span className={`badge ${isCleared ? 'badge-success' : 'badge-danger'}`}>
                    {isCleared ? 'FULL PAYMENT CLEARED' : 'PENDING BALANCE'}
                  </span>
                </div>
              </div>

              <div className="v-fin-totals">
                <div className="v-fin-row">
                  <span>Total Amount:</span>
                  <strong>{currencySymbol} {Number(client.totalAmount).toLocaleString('en-US')}</strong>
                </div>
                <div className="v-fin-row">
                  <span>Discount:</span>
                  <span>- {currencySymbol} {Number(client.discount).toLocaleString('en-US')}</span>
                </div>
                <div className="v-fin-row">
                  <span>Net Payable:</span>
                  <span>{currencySymbol} {netPayable.toLocaleString('en-US')}</span>
                </div>
                <div className="v-fin-row">
                  <span style={{ color: '#166534', fontWeight: 700 }}>Received Amount:</span>
                  <span style={{ color: '#166534', fontWeight: 800 }}>{currencySymbol} {Number(client.received).toLocaleString('en-US')}</span>
                </div>
                <div className="v-fin-row total-row">
                  <span style={{ color: isCleared ? '#166534' : '#dc2626' }}>
                    {isCleared ? 'Clear Balance:' : 'Balance Due:'}
                  </span>
                  <span style={{ color: isCleared ? '#166534' : '#dc2626' }}>
                    {currencySymbol} {balance.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Stamp & Authorized Signature Footer */}
            <div className="voucher-footer">
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Client Signature: __________________________</p>
              </div>
              <div className="voucher-stamp-area">
                <span>Agency Official Seal & Signature</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
