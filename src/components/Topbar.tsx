'use client';

import React from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  Download, 
  Database
} from 'lucide-react';

interface TopbarProps {
  currentView: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  onOpenAddClient: () => void;
  onOpenBackupModal: () => void;
  onOpenFirebaseModal: () => void;
  isFirebaseActive: boolean;
  onToggleMobileMenu: () => void;
}

export default function Topbar({
  currentView,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  onOpenAddClient,
  onOpenBackupModal,
  onOpenFirebaseModal,
  isFirebaseActive,
  onToggleMobileMenu
}: TopbarProps) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'clients':
        return {
          title: 'All Umrah Clients & Pilgrims',
          subtitle: 'Comprehensive database of pilgrims, flight itineraries, visas & stays'
        };
      case 'agencies':
        return {
          title: 'Partner Agencies Network',
          subtitle: 'Ticketing, Visa, Transport & Hotel suppliers management'
        };
      case 'reports':
        return {
          title: 'Financial & Balance Reports',
          subtitle: 'Live collection ledger, discounts, and clear balances'
        };
      default:
        return {
          title: 'Umrah Executive Dashboard',
          subtitle: 'Live pilgrim records, flight logistics & financial ledger'
        };
    }
  };

  const { title, subtitle } = getViewTitle();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          type="button" 
          className="mobile-toggle" 
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="page-title-box">
          <h2 className="page-title">{title}</h2>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Search */}
        <div className="search-box">
          <Search size={16} className="search-icon-inside" />
          <input
            type="text"
            className="search-input"
            placeholder="Search Name, Passport, CNIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>

        {/* Currency Switcher */}
        <select 
          className="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          title="Display Currency"
        >
          <option value="PKR">PKR (₨)</option>
          <option value="SAR">SAR (ر.س)</option>
          <option value="USD">USD ($)</option>
          <option value="AED">AED (د.إ)</option>
          <option value="GBP">GBP (£)</option>
        </select>

        {/* Firebase Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenFirebaseModal}
          title="Configure Firebase Cloud Database"
        >
          <Database size={15} color={isFirebaseActive ? '#10b981' : '#f59e0b'} />
          <span>{isFirebaseActive ? 'Cloud Live' : 'Firebase Setup'}</span>
        </button>

        {/* Backup / Export */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onOpenBackupModal}
          title="Backup & Export Data"
        >
          <Download size={15} />
          <span>Backup / CSV</span>
        </button>

        {/* Add Client */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenAddClient}
        >
          <Plus size={16} />
          <span>Add Client</span>
        </button>
      </div>
    </header>
  );
}
