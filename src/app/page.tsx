'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import DashboardMetrics from '@/components/DashboardMetrics';
import FinancialHealthCard from '@/components/FinancialHealthCard';
import AgencyPartnersCard from '@/components/AgencyPartnersCard';
import ClientTable from '@/components/ClientTable';
import ClientModal from '@/components/ClientModal';
import PrintableVoucherModal from '@/components/PrintableVoucherModal';
import FirebaseConfigModal from '@/components/FirebaseConfigModal';
import BackupModal from '@/components/BackupModal';
import AgencySettingsModal from '@/components/AgencySettingsModal';
import FinancialReportsView from '@/components/FinancialReportsView';
import AgencyPartnersView from '@/components/AgencyPartnersView';
import { ClientRecord, AgencyConfig } from '@/types';
import { 
  fetchClients, 
  addClient, 
  updateClient, 
  deleteClient, 
  fetchAgencyConfig, 
  saveAgencyConfig,
  isFirebaseConfigured,
  saveLocalClients
} from '@/lib/firebase';
import { initialClients, defaultAgencyConfig } from '@/lib/sampleData';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'agencies' | 'reports'>('dashboard');
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [agencyConfig, setAgencyConfig] = useState<AgencyConfig>(defaultAgencyConfig);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<string>('PKR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [clientModalOpen, setClientModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
  const [voucherClient, setVoucherClient] = useState<ClientRecord | null>(null);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState<boolean>(false);
  const [backupModalOpen, setBackupModalOpen] = useState<boolean>(false);
  const [agencySettingsOpen, setAgencySettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const currencySymbols: Record<string, string> = {
    PKR: '₨',
    SAR: 'ر.س',
    USD: '$',
    AED: 'د.إ',
    GBP: '£'
  };
  const currentSymbol = currencySymbols[currency] || '₨';

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const cfg = await fetchAgencyConfig();
      setAgencyConfig(cfg);

      const result = await fetchClients();
      setClients(result.clients);
      setIsFirebaseActive(result.isCloud);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute next available serial number
  const nextSerialNo = useMemo(() => {
    if (!clients.length) return '001';
    const nums = clients
      .map(c => parseInt(c.serialNo, 10))
      .filter(n => !isNaN(n));
    if (!nums.length) return String(clients.length + 1).padStart(3, '0');
    const max = Math.max(...nums);
    return String(max + 1).padStart(3, '0');
  }, [clients]);

  // Global search filtering
  const searchedClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.fatherOrHusbandName.toLowerCase().includes(q) ||
      c.passport.toLowerCase().includes(q) ||
      c.idCard.toLowerCase().includes(q) ||
      c.mobileNumber.toLowerCase().includes(q) ||
      c.serialNo.toLowerCase().includes(q) ||
      c.airline.toLowerCase().includes(q) ||
      c.makkahStay.toLowerCase().includes(q) ||
      c.medinahStay.toLowerCase().includes(q) ||
      c.visaNumber.toLowerCase().includes(q) ||
      c.applicationNumber.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  // Client CRUD Handlers
  const handleSaveClient = async (clientData: Omit<ClientRecord, 'id'>, id?: string) => {
    if (id) {
      const updated = await updateClient(id, clientData);
      setClients(prev => prev.map(c => c.id === id ? updated : c));
      showToast(`Updated record for ${clientData.name} (#${clientData.serialNo})`);
    } else {
      const created = await addClient(clientData);
      setClients(prev => [created, ...prev]);
      showToast(`Added new Umrah pilgrim ${clientData.name} (#${clientData.serialNo})`);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this Umrah client record?')) {
      await deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
      showToast('Client record deleted.');
    }
  };

  const handleOpenEdit = (client: ClientRecord) => {
    setEditingClient(client);
    setClientModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingClient(null);
    setClientModalOpen(true);
  };

  const handleSaveAgencyConfig = async (newConfig: AgencyConfig) => {
    await saveAgencyConfig(newConfig);
    setAgencyConfig(newConfig);
    showToast('Agency partner settings saved successfully.');
  };

  const handleResetDemoData = () => {
    saveLocalClients(initialClients);
    setClients(initialClients);
    showToast('Reset to sample demo Umrah clients.');
  };

  const handleImportClients = (imported: ClientRecord[]) => {
    saveLocalClients(imported);
    setClients(imported);
    showToast(`Imported ${imported.length} clients successfully.`);
  };

  // CSV Export utility
  const handleExportCsv = () => {
    const headers = [
      'Serial No',
      'Name',
      'Father/Husband Name',
      'Mobile Number',
      'ID Card (CNIC)',
      'Passport',
      'Days',
      'Travel Date IN',
      'Travel Date OUT',
      'Airport IN',
      'Airport OUT',
      'Airline',
      'Hotel Package',
      'Makkah Stay',
      'Medinah Stay',
      'Visa Type',
      'Visa Number',
      'Application Number',
      'Transport Type',
      'Room Type',
      'Meal Plan',
      'Ziyarat',
      'Total Amount',
      'Discount',
      'Received',
      'Clear Balance',
      'Payment Status',
      'Travel Status',
      'Umrah Agency Name',
      'Ticket Agency Name',
      'Visa Agency Name',
      'Transport Agency Name',
      'Hotel Agency Name',
      'Notes'
    ];

    const rows = clients.map(c => [
      `"${c.serialNo}"`,
      `"${c.name}"`,
      `"${c.fatherOrHusbandName}"`,
      `"${c.mobileNumber}"`,
      `"${c.idCard}"`,
      `"${c.passport}"`,
      `"${c.days}"`,
      `"${c.travelDateIn}"`,
      `"${c.travelDateOut}"`,
      `"${c.airportIn}"`,
      `"${c.airportOut}"`,
      `"${c.airline}"`,
      `"${c.hotel}"`,
      `"${c.makkahStay}"`,
      `"${c.medinahStay}"`,
      `"${c.visaType}"`,
      `"${c.visaNumber}"`,
      `"${c.applicationNumber}"`,
      `"${c.transportType}"`,
      `"${c.roomType}"`,
      `"${c.mealPlan}"`,
      `"${c.ziyarat}"`,
      c.totalAmount,
      c.discount,
      c.received,
      c.clearBalance,
      `"${c.paymentStatus || ''}"`,
      `"${c.travelStatus || ''}"`,
      `"${c.fullPackageAgencyName}"`,
      `"${c.ticketAgencyName}"`,
      `"${c.visaAgencyName}"`,
      `"${c.transportAgencyName}"`,
      `"${c.hotelAgencyName}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UsmanTravel_Pilgrims_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV file downloaded successfully.');
  };

  const totalGross = clients.reduce((acc, c) => acc + (Number(c.totalAmount) || 0), 0);
  const totalReceived = clients.reduce((acc, c) => acc + (Number(c.received) || 0), 0);
  const totalDiscount = clients.reduce((acc, c) => acc + (Number(c.discount) || 0), 0);
  const netAmount = totalGross - totalDiscount;
  const clearBalanceRatio = netAmount > 0 ? Math.round((totalReceived / netAmount) * 100) : 0;

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        clientCount={clients.length}
        agencyConfig={agencyConfig}
        isFirebaseActive={isFirebaseActive}
        onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
        isOpenMobile={mobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Topbar
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currency={currency}
          setCurrency={setCurrency}
          onOpenAddClient={handleOpenAdd}
          onOpenBackupModal={() => setBackupModalOpen(true)}
          onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
          isFirebaseActive={isFirebaseActive}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <div className="page-container">
          {/* View: Dashboard */}
          {currentView === 'dashboard' && (
            <>
              {/* Islamic Welcome Banner */}
              <div className="welcome-banner">
                <div className="banner-text">
                  <div className="bismillah-tag">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                  <h3 className="banner-heading">Umrah Management & Accounts Dashboard</h3>
                  <p className="banner-desc">
                    Integrated management of pilgrim records, flight logistics, Makkah & Madinah accommodations, partner agencies, and real-time financial clear balances.
                  </p>
                </div>
                <div className="banner-quick-stats">
                  <div className="stat-pill">
                    <span className="stat-pill-label">Today:</span>
                    <span className="stat-pill-val">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="stat-pill highlight">
                    <span className="stat-pill-label">Collection Rate:</span>
                    <span className="stat-pill-val">{clearBalanceRatio}% Cleared</span>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <DashboardMetrics clients={clients} currencySymbol={currentSymbol} />

              {/* 2-Column: Financials & Partner Agencies */}
              <div className="dashboard-grid-2col">
                <FinancialHealthCard clients={clients} currencySymbol={currentSymbol} />
                <AgencyPartnersCard 
                  clients={clients} 
                  agencyConfig={agencyConfig}
                  onManageAgencies={() => setAgencySettingsOpen(true)}
                />
              </div>

              {/* Client Data Table */}
              <ClientTable
                clients={searchedClients}
                currencySymbol={currentSymbol}
                onEditClient={handleOpenEdit}
                onDeleteClient={handleDeleteClient}
                onViewVoucher={(client) => setVoucherClient(client)}
                onOpenAddClient={handleOpenAdd}
                onExportCsv={handleExportCsv}
              />
            </>
          )}

          {/* View: Clients & Pilgrims List */}
          {currentView === 'clients' && (
            <ClientTable
              clients={searchedClients}
              currencySymbol={currentSymbol}
              onEditClient={handleOpenEdit}
              onDeleteClient={handleDeleteClient}
              onViewVoucher={(client) => setVoucherClient(client)}
              onOpenAddClient={handleOpenAdd}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* View: Agency Partners */}
          {currentView === 'agencies' && (
            <AgencyPartnersView
              clients={clients}
              agencyConfig={agencyConfig}
              onOpenAgencySettings={() => setAgencySettingsOpen(true)}
              currencySymbol={currentSymbol}
            />
          )}

          {/* View: Financial Reports */}
          {currentView === 'reports' && (
            <FinancialReportsView
              clients={clients}
              currencySymbol={currentSymbol}
            />
          )}
        </div>
      </main>

      {/* Add / Edit Client Modal */}
      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        onSave={handleSaveClient}
        editingClient={editingClient}
        agencyConfig={agencyConfig}
        nextSerialNo={nextSerialNo}
      />

      {/* Printable Voucher Modal */}
      <PrintableVoucherModal
        client={voucherClient}
        agencyConfig={agencyConfig}
        currencySymbol={currentSymbol}
        onClose={() => setVoucherClient(null)}
      />

      {/* Firebase Cloud Config Modal */}
      <FirebaseConfigModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onConfigSaved={loadData}
      />

      {/* Backup & Portability Modal */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        clients={clients}
        agencyConfig={agencyConfig}
        onImportClients={handleImportClients}
        onResetDemo={handleResetDemoData}
        onExportCsv={handleExportCsv}
      />

      {/* Agency Settings Modal */}
      <AgencySettingsModal
        isOpen={agencySettingsOpen}
        onClose={() => setAgencySettingsOpen(false)}
        config={agencyConfig}
        onSaveConfig={handleSaveAgencyConfig}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
