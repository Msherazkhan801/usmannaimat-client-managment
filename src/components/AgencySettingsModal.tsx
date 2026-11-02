'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { AgencyConfig } from '@/types';

interface AgencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgencyConfig;
  onSaveConfig: (updated: AgencyConfig) => Promise<void>;
}

export default function AgencySettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig
}: AgencySettingsModalProps) {
  const [formData, setFormData] = useState<AgencyConfig>(config);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveConfig(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating agency configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog modal-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="#047857" />
              Agency & Vendor Network Settings
            </h3>
            <p className="modal-subtitle">
              Configure agency defaults for ticketing, visa issuance, Saudi ground transport & hotels
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Umrah Full Package Travel Agency Name <span className="req">*</span></label>
              <input
                type="text"
                required
                value={formData.fullPackageAgencyName}
                onChange={(e) => setFormData({ ...formData, fullPackageAgencyName: e.target.value })}
                placeholder="e.g. Usman Travel Management"
              />
              <span className="form-hint">This name appears on official vouchers, invoices and booking confirmations.</span>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Ticket Agency Name <span className="req">*</span></label>
              <input
                type="text"
                required
                value={formData.ticketAgencyName}
                onChange={(e) => setFormData({ ...formData, ticketAgencyName: e.target.value })}
                placeholder="e.g. Al-Haramain Aviation Services"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Visa Agency Name <span className="req">*</span></label>
              <input
                type="text"
                required
                value={formData.visaAgencyName}
                onChange={(e) => setFormData({ ...formData, visaAgencyName: e.target.value })}
                placeholder="e.g. Bab-e-Mecca Visa Consultants"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Transport Agency Name <span className="req">*</span></label>
              <input
                type="text"
                required
                value={formData.transportAgencyName}
                onChange={(e) => setFormData({ ...formData, transportAgencyName: e.target.value })}
                placeholder="e.g. Saptco VIP & Al-Wissam Transport Saudi"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Hotel Agency / Supplier Name <span className="req">*</span></label>
              <input
                type="text"
                required
                value={formData.hotelAgencyName}
                onChange={(e) => setFormData({ ...formData, hotelAgencyName: e.target.value })}
                placeholder="e.g. Al-Rawda B2B Hospitality Group"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Agency Contact Phone</label>
                <input
                  type="text"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+92 300 8472910"
                />
              </div>
              <div className="form-group">
                <label>Agency Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@usmantravel.com"
                />
              </div>
            </div>

            <div className="form-group mt-3">
              <label>Office Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Office Address, City, Country"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Agency Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
