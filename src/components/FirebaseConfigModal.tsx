'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { FirebaseConfigState } from '@/types';
import { getSavedFirebaseConfig, saveFirebaseConfig, isFirebaseConfigured } from '@/lib/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export default function FirebaseConfigModal({
  isOpen,
  onClose,
  onConfigSaved
}: FirebaseConfigModalProps) {
  const [config, setConfig] = useState<FirebaseConfigState>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  });

  const [jsonInput, setJsonInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedFirebaseConfig();
      setConfig(current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJsonPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonInput(text);
    try {
      // Allow pasting either raw JSON or firebaseConfig object code
      const cleaned = text
        .replace(/const firebaseConfig =/g, '')
        .replace(/;/g, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.projectId || parsed.apiKey) {
        setConfig({
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || '',
          projectId: parsed.projectId || '',
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || '',
          measurementId: parsed.measurementId || ''
        });
        setSaveStatus('Auto-detected credentials from pasted config!');
      }
    } catch {
      // not JSON yet, continue typing
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(config);
    setSaveStatus('Firebase configuration saved successfully! Reloading connection...');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    const emptyConfig: FirebaseConfigState = {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: ''
    };
    setConfig(emptyConfig);
    saveFirebaseConfig(emptyConfig);
    setSaveStatus('Switched to Local Storage fallback mode.');
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 600);
  };

  const isConfigured = isFirebaseConfigured(config);

  return (
    <div className="modal-overlay active">
      <div className="modal-dialog modal-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="#f59e0b" />
              Firebase Cloud Database Configuration
            </h3>
            <p className="modal-subtitle">
              Connect your Firebase Project & Cloud Firestore for real-time live data persistence
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            
            {/* Status Alert */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              backgroundColor: isConfigured ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${isConfigured ? '#a7f3d0' : '#fde68a'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {isConfigured ? (
                <>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
                    Connected to Project: <strong>{config.projectId}</strong>
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} color="#d97706" />
                  <span style={{ fontSize: '0.82rem', color: '#92400e' }}>
                    Currently using <strong>Local Storage Mode</strong>. Enter your Firebase web credentials below to sync with Cloud Firestore.
                  </span>
                </>
              )}
            </div>

            {/* Paste Firebase config snippet */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quick Paste from Firebase Console (Optional)</span>
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ fontSize: '0.72rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Open Firebase Console <ExternalLink size={10} />
                </a>
              </label>
              <textarea
                rows={2}
                placeholder="Paste your firebaseConfig snippet or JSON here to auto-fill..."
                value={jsonInput}
                onChange={handleJsonPaste}
                style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Individual Credentials
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Project ID <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. usman-travel-umrah"
                  value={config.projectId}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>API Key <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Auth Domain</label>
                <input
                  type="text"
                  placeholder="your-app.firebaseapp.com"
                  value={config.authDomain}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>App ID <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Storage Bucket</label>
                <input
                  type="text"
                  placeholder="your-app.appspot.com"
                  value={config.storageBucket}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Messaging Sender ID</label>
                <input
                  type="text"
                  placeholder="123456789"
                  value={config.messagingSenderId}
                  onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                />
              </div>
            </div>

            {saveStatus && (
              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
                {saveStatus}
              </div>
            )}

          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleClear}
              title="Reset to local offline storage"
            >
              Use Local Storage
            </button>
            <button type="submit" className="btn btn-primary">
              Save & Connect Firebase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
