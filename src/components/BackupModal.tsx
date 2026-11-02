'use client';

import React, { useRef } from 'react';
import { X, Download, Upload, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { ClientRecord, AgencyConfig } from '@/types';
import { initialClients } from '@/lib/sampleData';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientRecord[];
  agencyConfig: AgencyConfig;
  onImportClients: (imported: ClientRecord[]) => void;
  onResetDemo: () => void;
  onExportCsv: () => void;
}

export default function BackupModal({
  isOpen,
  onClose,
  clients,
  agencyConfig,
  onImportClients,
  onResetDemo,
  onExportCsv
}: BackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const backupData = {
      agencyConfig,
      clients,
      exportDate: new Date().toISOString(),
      version: '2.0.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UsmanTravel_Umrah_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.clients)) {
          onImportClients(parsed.clients);
          alert(`Successfully imported ${parsed.clients.length} client records!`);
          onClose();
        } else if (Array.isArray(parsed)) {
          onImportClients(parsed);
          alert(`Successfully imported ${parsed.length} client records!`);
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        console.error(err);
        alert('Could not read or parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog modal-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title">Data Backup, Export & Portability</h3>
            <p className="modal-subtitle">Safely download, export to Excel/CSV, or restore your pilgrim records</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="backup-options">
            {/* JSON Export */}
            <div className="backup-card">
              <h4>Export JSON Backup</h4>
              <p>Complete data archive containing all clients, travel schedules, hotel stays, and financial ledger.</p>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleExportJson}
              >
                <Download size={14} />
                <span>Download JSON Backup</span>
              </button>
            </div>

            {/* CSV Export */}
            <div className="backup-card">
              <h4>Export CSV Spreadsheet</h4>
              <p>Download client records into Microsoft Excel / CSV spreadsheet for offline accounting and printing.</p>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onExportCsv}
              >
                <FileSpreadsheet size={14} />
                <span>Download CSV File</span>
              </button>
            </div>

            {/* Import Backup */}
            <div className="backup-card">
              <h4>Import JSON Backup</h4>
              <p>Restore client database from a previously exported JSON backup file on your computer.</p>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileUpload}
              />
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                <span>Upload Backup File</span>
              </button>
            </div>

            {/* Reset Sample Demo Data */}
            <div className="backup-card danger-zone">
              <h4>Reload Demo Sample Data</h4>
              <p>Reset the system to 6 realistic pre-loaded Pakistani Umrah client packages.</p>
              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  if (confirm('Load sample demonstration clients?')) {
                    onResetDemo();
                    onClose();
                  }
                }}
              >
                <RefreshCw size={14} />
                <span>Load Sample Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
