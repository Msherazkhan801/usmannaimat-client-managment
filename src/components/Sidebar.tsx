'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileSpreadsheet, 
  Database,
  Compass
} from 'lucide-react';
import { AgencyConfig } from '@/types';

interface SidebarProps {
  currentView: 'dashboard' | 'clients' | 'agencies' | 'reports';
  setCurrentView: (view: 'dashboard' | 'clients' | 'agencies' | 'reports') => void;
  clientCount: number;
  agencyConfig: AgencyConfig;
  isFirebaseActive: boolean;
  onOpenFirebaseModal: () => void;
  isOpenMobile: boolean;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  clientCount,
  agencyConfig,
  isFirebaseActive,
  onOpenFirebaseModal,
  isOpenMobile
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
      <div className="brand-section">
        <div className="brand-icon">
          <Compass size={24} />
        </div>
        <div className="brand-info">
          <h1 className="brand-title">Usman Travel</h1>
          <span className="brand-subtitle">Umrah & Hajj Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'clients' ? 'active' : ''}`}
          onClick={() => setCurrentView('clients')}
        >
          <Users size={20} />
          <span>Clients & Pilgrims</span>
          <span className="nav-badge">{clientCount}</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'agencies' ? 'active' : ''}`}
          onClick={() => setCurrentView('agencies')}
        >
          <Building2 size={20} />
          <span>Agency Partners</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
          onClick={() => setCurrentView('reports')}
        >
          <FileSpreadsheet size={20} />
          <span>Financial Reports</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button 
          type="button" 
          className="cloud-status-badge"
          onClick={onOpenFirebaseModal}
          title="Click to configure Firebase Firestore cloud connection"
        >
          <span className={`cloud-dot ${isFirebaseActive ? 'connected' : 'local'}`}></span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <span style={{ display: 'block', fontWeight: 700, color: '#fff', fontSize: '0.78rem' }}>
              {isFirebaseActive ? 'Firebase Firestore' : 'Local Storage Mode'}
            </span>
            <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.68rem' }}>
              {isFirebaseActive ? 'Real-time cloud sync active' : 'Click to connect Firebase'}
            </span>
          </div>
          <Database size={14} color="#a7f3d0" />
        </button>

        <div style={{ padding: '8px 4px', fontSize: '0.72rem', color: '#cbd5e1' }}>
          <strong style={{ display: 'block', color: '#fef3c7', fontSize: '0.78rem' }}>
            {agencyConfig.fullPackageAgencyName}
          </strong>
          <span>Full Umrah System v2.0</span>
        </div>
      </div>
    </aside>
  );
}
