'use client';

import React, { useState, useEffect } from 'react';
import { ClientRecord, AgencyConfig } from '@/types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<ClientRecord, 'id'>, id?: string) => Promise<void>;
  editingClient: ClientRecord | null;
  agencyConfig: AgencyConfig;
  nextSerialNo: string;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  editingClient,
  agencyConfig,
  nextSerialNo
}: ClientModalProps) {
  const [formData, setFormData] = useState<Omit<ClientRecord, 'id'>>({
    serialNo: nextSerialNo,
    name: '',
    fatherOrHusbandName: '',
    mobileNumber: '',
    idCard: '',
    passport: '',
    days: 15,
    travelDateIn: '',
    travelDateOut: '',
    airportIn: 'Lahore (LHE)',
    airportOut: 'Jeddah (JED)',
    airline: 'Saudi Arabian Airlines (Saudia)',
    hotel: '5-Star Executive / 4-Star Economy',
    makkahStay: '7 Nights - Clock Tower Hotel',
    medinahStay: '7 Nights - Markazia North Hotel',
    visaType: 'Umrah eVisa',
    visaNumber: '',
    applicationNumber: '',
    transportType: 'VIP Sharing Bus (Circle)',
    roomType: 'Quad',
    mealPlan: 'Bed & Breakfast (BB)',
    ziyarat: 'Complete Makkah & Madinah Ziyarat Included',
    totalAmount: 350000,
    discount: 0,
    received: 0,
    clearBalance: 350000,
    paymentStatus: 'Pending Payment',
    travelStatus: 'Upcoming',
    fullPackageAgencyName: agencyConfig.fullPackageAgencyName,
    ticketAgencyName: agencyConfig.ticketAgencyName,
    visaAgencyName: agencyConfig.visaAgencyName,
    transportAgencyName: agencyConfig.transportAgencyName,
    hotelAgencyName: agencyConfig.hotelAgencyName,
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        serialNo: editingClient.serialNo || '',
        name: editingClient.name || '',
        fatherOrHusbandName: editingClient.fatherOrHusbandName || '',
        mobileNumber: editingClient.mobileNumber || '',
        idCard: editingClient.idCard || '',
        passport: editingClient.passport || '',
        days: editingClient.days || 15,
        travelDateIn: editingClient.travelDateIn || '',
        travelDateOut: editingClient.travelDateOut || '',
        airportIn: editingClient.airportIn || '',
        airportOut: editingClient.airportOut || '',
        airline: editingClient.airline || '',
        hotel: editingClient.hotel || '',
        makkahStay: editingClient.makkahStay || '',
        medinahStay: editingClient.medinahStay || '',
        visaType: editingClient.visaType || 'Umrah eVisa',
        visaNumber: editingClient.visaNumber || '',
        applicationNumber: editingClient.applicationNumber || '',
        transportType: editingClient.transportType || 'VIP Sharing Bus (Circle)',
        roomType: editingClient.roomType || 'Quad',
        mealPlan: editingClient.mealPlan || 'Bed & Breakfast (BB)',
        ziyarat: editingClient.ziyarat || '',
        totalAmount: Number(editingClient.totalAmount) || 0,
        discount: Number(editingClient.discount) || 0,
        received: Number(editingClient.received) || 0,
        clearBalance: Number(editingClient.clearBalance) || 0,
        paymentStatus: editingClient.paymentStatus || 'Pending Payment',
        travelStatus: editingClient.travelStatus || 'Upcoming',
        fullPackageAgencyName: editingClient.fullPackageAgencyName || agencyConfig.fullPackageAgencyName,
        ticketAgencyName: editingClient.ticketAgencyName || agencyConfig.ticketAgencyName,
        visaAgencyName: editingClient.visaAgencyName || agencyConfig.visaAgencyName,
        transportAgencyName: editingClient.transportAgencyName || agencyConfig.transportAgencyName,
        hotelAgencyName: editingClient.hotelAgencyName || agencyConfig.hotelAgencyName,
        notes: editingClient.notes || ''
      });
    } else {
      // New Client defaults
      setFormData({
        serialNo: nextSerialNo,
        name: '',
        fatherOrHusbandName: '',
        mobileNumber: '',
        idCard: '',
        passport: '',
        days: 15,
        travelDateIn: '',
        travelDateOut: '',
        airportIn: 'Lahore (LHE)',
        airportOut: 'Jeddah (JED)',
        airline: 'Saudi Arabian Airlines (Saudia)',
        hotel: 'Executive Deluxe Package',
        makkahStay: '7 Nights - Pullman Zamzam Makkah',
        medinahStay: '7 Nights - Anwar Al Madinah',
        visaType: 'Umrah eVisa',
        visaNumber: '',
        applicationNumber: '',
        transportType: 'VIP Sharing Bus (Circle)',
        roomType: 'Quad',
        mealPlan: 'Bed & Breakfast (BB)',
        ziyarat: 'Complete Makkah & Madinah Ziyarat Included',
        totalAmount: 350000,
        discount: 0,
        received: 0,
        clearBalance: 350000,
        paymentStatus: 'Pending Payment',
        travelStatus: 'Upcoming',
        fullPackageAgencyName: agencyConfig.fullPackageAgencyName,
        ticketAgencyName: agencyConfig.ticketAgencyName,
        visaAgencyName: agencyConfig.visaAgencyName,
        transportAgencyName: agencyConfig.transportAgencyName,
        hotelAgencyName: agencyConfig.hotelAgencyName,
        notes: ''
      });
    }
  }, [editingClient, agencyConfig, nextSerialNo, isOpen]);

  // Handle live calculation of clear balance
  const updateFinance = (field: 'totalAmount' | 'discount' | 'received', value: number) => {
    const updated = { ...formData, [field]: value };
    const total = field === 'totalAmount' ? value : Number(updated.totalAmount) || 0;
    const disc = field === 'discount' ? value : Number(updated.discount) || 0;
    const recv = field === 'received' ? value : Number(updated.received) || 0;

    const clearBalance = Math.max(0, total - disc - recv);
    let paymentStatus: ClientRecord['paymentStatus'] = 'Pending Payment';
    if (clearBalance <= 0 && total > 0) {
      paymentStatus = 'Fully Paid';
    } else if (recv > 0) {
      paymentStatus = 'Partial Balance';
    }

    setFormData({
      ...updated,
      clearBalance,
      paymentStatus
    });
  };

  // Auto calculate days when dates change
  const handleDateChange = (type: 'travelDateIn' | 'travelDateOut', val: string) => {
    const dateIn = type === 'travelDateIn' ? val : formData.travelDateIn;
    const dateOut = type === 'travelDateOut' ? val : formData.travelDateOut;

    let computedDays = formData.days;
    if (dateIn && dateOut) {
      const d1 = new Date(dateIn);
      const d2 = new Date(dateOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        computedDays = diffDays;
      }
    }

    setFormData({
      ...formData,
      [type]: val,
      days: computedDays
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.passport || !formData.mobileNumber) {
      alert('Please fill in required fields: Name, Mobile, and Passport.');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData, editingClient?.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving client record.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const isCleared = formData.clearBalance <= 0;

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog modal-xl">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">
              {editingClient ? `Edit Umrah Client #${formData.serialNo}` : 'Add New Umrah Pilgrim / Client'}
            </h3>
            <p className="modal-subtitle">
              Record identity, flight itinerary, hotel accommodations, partner agencies, and financial balances.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Section 1: Client Personal Details */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">1</div>
                <div>
                  <h4 className="section-title">Client Identity & Contact</h4>
                  <span className="section-subtitle">Pilgrim personal identification details</span>
                </div>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Serial No count <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.serialNo}
                    onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                    placeholder="e.g. 001"
                  />
                </div>
                <div className="form-group">
                  <label>Name (Pilgrim Full Name) <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Muhammad Usman"
                  />
                </div>
                <div className="form-group">
                  <label>F/H-Name (Father / Husband Name) <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.fatherOrHusbandName}
                    onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                    placeholder="Father or Husband name"
                  />
                </div>
                <div className="form-group">
                  <label>Mob Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="e.g. +92 300 1234567"
                  />
                </div>
                <div className="form-group">
                  <label>I’d card (CNIC) <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    placeholder="e.g. 35201-1234567-1"
                  />
                </div>
                <div className="form-group">
                  <label>Passport <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    placeholder="e.g. PK1234567"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Travel & Flight Details */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">2</div>
                <div>
                  <h4 className="section-title">Travel Dates & Flight Route</h4>
                  <span className="section-subtitle">Departure, return dates, total days, airline, and airports</span>
                </div>
              </div>
              <div className="form-grid-4">
                <div className="form-group">
                  <label>Travel date in (Departure) <span className="req">*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.travelDateIn}
                    onChange={(e) => handleDateChange('travelDateIn', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Travel date out (Return) <span className="req">*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.travelDateOut}
                    onChange={(e) => handleDateChange('travelDateOut', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Days (Duration) <span className="req">*</span></label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Airline <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.airline}
                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                    placeholder="e.g. Saudia, PIA, Airblue"
                  />
                </div>
                <div className="form-group">
                  <label>Airport in travel (Departure Airport)</label>
                  <input
                    type="text"
                    value={formData.airportIn}
                    onChange={(e) => setFormData({ ...formData, airportIn: e.target.value })}
                    placeholder="e.g. Lahore (LHE)"
                  />
                </div>
                <div className="form-group">
                  <label>Airport out travel (Arrival Airport)</label>
                  <input
                    type="text"
                    value={formData.airportOut}
                    onChange={(e) => setFormData({ ...formData, airportOut: e.target.value })}
                    placeholder="e.g. Jeddah (JED)"
                  />
                </div>
                <div className="form-group">
                  <label>Travel Status</label>
                  <select
                    value={formData.travelStatus}
                    onChange={(e) => setFormData({ ...formData, travelStatus: e.target.value as any })}
                  >
                    <option value="Upcoming">Upcoming Departure</option>
                    <option value="In Makkah">Currently In Makkah</option>
                    <option value="In Madinah">Currently In Madinah</option>
                    <option value="Completed">Completed / Returned</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Accommodation, Stays & Hospitality */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">3</div>
                <div>
                  <h4 className="section-title">Hotel, Stays & Hospitality</h4>
                  <span className="section-subtitle">Makkah stay, Medinah stay, room category, and meal plan</span>
                </div>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Hotel (Package Title)</label>
                  <input
                    type="text"
                    value={formData.hotel}
                    onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                    placeholder="e.g. 5-Star Executive Clock Tower"
                  />
                </div>
                <div className="form-group">
                  <label>Makkah stay <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.makkahStay}
                    onChange={(e) => setFormData({ ...formData, makkahStay: e.target.value })}
                    placeholder="e.g. 7 Nights - Pullman Zamzam"
                  />
                </div>
                <div className="form-group">
                  <label>Medinah stay <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.medinahStay}
                    onChange={(e) => setFormData({ ...formData, medinahStay: e.target.value })}
                    placeholder="e.g. 7 Nights - Anwar Al Madinah"
                  />
                </div>
                <div className="form-group">
                  <label>Room type <span className="req">*</span></label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  >
                    <option value="Sharing">Sharing (Standard / 5-6 Bed)</option>
                    <option value="Quad">Quad (4 Persons Room)</option>
                    <option value="Triple">Triple (3 Persons Room)</option>
                    <option value="Double">Double (2 Persons / Twin Room)</option>
                    <option value="Single">Single (Private Room)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Breakfast lunch dinner (Meal Plan) <span className="req">*</span></label>
                  <select
                    value={formData.mealPlan}
                    onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                  >
                    <option value="Room Only (No Meals)">Room Only (No Meals)</option>
                    <option value="Bed & Breakfast (BB)">Bed & Breakfast (BB)</option>
                    <option value="Half Board (Breakfast + Dinner)">Half Board (Breakfast + Dinner)</option>
                    <option value="Full Board (B + L + D)">Full Board (Breakfast + Lunch + Dinner)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ziarth (Ziyarah Plan) <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.ziyarat}
                    onChange={(e) => setFormData({ ...formData, ziyarat: e.target.value })}
                    placeholder="e.g. Makkah & Madinah Ziyarat Included"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Visa & Transport */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">4</div>
                <div>
                  <h4 className="section-title">Visa & Ground Transport</h4>
                  <span className="section-subtitle">Visa types, credentials & ground fleet</span>
                </div>
              </div>
              <div className="form-grid-4">
                <div className="form-group">
                  <label>Visa type <span className="req">*</span></label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                  >
                    <option value="Umrah eVisa">Umrah eVisa (Electronic)</option>
                    <option value="Tourist eVisa">Tourist eVisa (1 Year Multiple)</option>
                    <option value="Transit / Stopover">Transit / Stopover Visa</option>
                    <option value="Family Visit">Family Visit Visa</option>
                    <option value="Business / Work">Business / Work Visa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Visa number</label>
                  <input
                    type="text"
                    value={formData.visaNumber}
                    onChange={(e) => setFormData({ ...formData, visaNumber: e.target.value })}
                    placeholder="e.g. 6001234567"
                  />
                </div>
                <div className="form-group">
                  <label>Application number (MoFA)</label>
                  <input
                    type="text"
                    value={formData.applicationNumber}
                    onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                    placeholder="e.g. MOFA-PK-2026-1234"
                  />
                </div>
                <div className="form-group">
                  <label>Trasport type <span className="req">*</span></label>
                  <select
                    value={formData.transportType}
                    onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                  >
                    <option value="VIP Sharing Bus (Circle)">VIP Sharing Bus (Circle Route)</option>
                    <option value="Private Sedan (Camry/Sonata)">Private Sedan (Camry/Sonata)</option>
                    <option value="Private GMC / Yukon">Private GMC / Yukon (Family Luxury)</option>
                    <option value="Private HiAce (10-12 Seater)">Private HiAce (10-12 Seater)</option>
                    <option value="Private Coaster (20-25 Seater)">Private Coaster (20-25 Seater)</option>
                    <option value="Haramain High-Speed Train">Haramain High-Speed Train</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Partner Agency Tracking */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">5</div>
                <div>
                  <h4 className="section-title">Partner Agencies & Suppliers</h4>
                  <span className="section-subtitle">B2B suppliers for tickets, visas, transports & hotels</span>
                </div>
              </div>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Umrah Full Packge travel agency name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.fullPackageAgencyName}
                    onChange={(e) => setFormData({ ...formData, fullPackageAgencyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ticket agency name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.ticketAgencyName}
                    onChange={(e) => setFormData({ ...formData, ticketAgencyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Visa agency name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.visaAgencyName}
                    onChange={(e) => setFormData({ ...formData, visaAgencyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Transport agency name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.transportAgencyName}
                    onChange={(e) => setFormData({ ...formData, transportAgencyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Hotel agency name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.hotelAgencyName}
                    onChange={(e) => setFormData({ ...formData, hotelAgencyName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Financials & Clear Balance Calculation */}
            <div className="form-section highlight-section">
              <div className="section-header">
                <div className="section-num">6</div>
                <div>
                  <h4 className="section-title">Financials & Live Clear Balance Calculation</h4>
                  <span className="section-subtitle">Real-time computation: Clear Balance = Total - Discount - Received</span>
                </div>
              </div>
              <div className="form-grid-4">
                <div className="form-group">
                  <label>Total amount <span className="req">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => updateFinance('totalAmount', Number(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Discount</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.discount}
                    onChange={(e) => updateFinance('discount', Number(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Recived (Paid) <span className="req">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.received}
                    onChange={(e) => updateFinance('received', Number(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group">
                  <label>Clear balance (Auto-calculated)</label>
                  <div className={`balance-display-box ${isCleared ? 'cleared' : ''}`}>
                    <input
                      type="text"
                      readOnly
                      value={formData.clearBalance.toLocaleString('en-US')}
                    />
                    <span className="balance-status-badge">
                      {isCleared ? 'Cleared' : 'Due Balance'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group mt-3">
                <label>Special Instructions & Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Senior citizen assistance, Haram facing room request..."
                />
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (editingClient ? 'Update Client Record' : 'Save Umrah Client Record')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
