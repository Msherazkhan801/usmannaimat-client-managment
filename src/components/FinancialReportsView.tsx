'use client';

import React from 'react';
import { Printer, Download, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClientRecord } from '@/types';

interface FinancialReportsViewProps {
  clients: ClientRecord[];
  currencySymbol: string;
}

export default function FinancialReportsView({ clients, currencySymbol }: FinancialReportsViewProps) {
  const totalGross = clients.reduce((acc, c) => acc + (Number(c.totalAmount) || 0), 0);
  const totalDiscount = clients.reduce((acc, c) => acc + (Number(c.discount) || 0), 0);
  const totalReceived = clients.reduce((acc, c) => acc + (Number(c.received) || 0), 0);
  const totalClearBalance = clients.reduce((acc, c) => acc + (Number(c.clearBalance) || 0), 0);
  const netAmount = totalGross - totalDiscount;

  const formatMoney = (val: number) => `${currencySymbol} ${(Number(val) || 0).toLocaleString('en-US')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <h3 className="card-title">Financial Accounts & Clear Balance Reconciliation</h3>
          <span className="card-subtitle">Complete ledger of receivables, client discounts, payments, and dues</span>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handlePrint}
        >
          <Printer size={15} />
          <span>Print Financial Report</span>
        </button>
      </div>

      <div className="card-body">
        {/* Metric summary boxes */}
        <div className="metrics-grid" style={{ marginBottom: '24px' }}>
          <div className="metric-card">
            <div className="metric-icon blue">
              <DollarSign size={22} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Gross Bookings</span>
              <h4 className="metric-value">{formatMoney(totalGross)}</h4>
              <span className="metric-trend neutral">{clients.length} Total Packages</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon red">
              <AlertCircle size={22} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Client Discounts</span>
              <h4 className="metric-value" style={{ color: '#d97706' }}>{formatMoney(totalDiscount)}</h4>
              <span className="metric-trend neutral">Net: {formatMoney(netAmount)}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon emerald">
              <CheckCircle2 size={22} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Received / Paid</span>
              <h4 className="metric-value text-success">{formatMoney(totalReceived)}</h4>
              <span className="metric-trend positive">
                {netAmount > 0 ? Math.round((totalReceived / netAmount) * 100) : 0}% Realized
              </span>
            </div>
          </div>

          <div className="metric-card danger-card">
            <div className="metric-icon red">
              <AlertCircle size={22} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Clear Balance Outstanding</span>
              <h4 className="metric-value text-danger">{formatMoney(totalClearBalance)}</h4>
              <span className="metric-trend negative">Receivable from Pilgrims</span>
            </div>
          </div>
        </div>

        {/* Financial Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Client Name</th>
                <th>Mobile Number</th>
                <th>Passport</th>
                <th>Total Package</th>
                <th>Discount</th>
                <th>Net Payable</th>
                <th>Received</th>
                <th>Clear Balance Due</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const net = (Number(c.totalAmount) || 0) - (Number(c.discount) || 0);
                const bal = Number(c.clearBalance) || 0;
                const isCleared = bal <= 0;

                return (
                  <tr key={c.id || c.serialNo}>
                    <td style={{ fontWeight: 700, color: '#047857' }}>#{c.serialNo}</td>
                    <td>
                      <strong>{c.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                        F/H: {c.fatherOrHusbandName}
                      </span>
                    </td>
                    <td>{c.mobileNumber}</td>
                    <td style={{ fontFamily: 'monospace' }}>{c.passport}</td>
                    <td>{formatMoney(c.totalAmount)}</td>
                    <td style={{ color: '#d97706' }}>- {formatMoney(c.discount)}</td>
                    <td><strong>{formatMoney(net)}</strong></td>
                    <td style={{ color: '#16a34a', fontWeight: 700 }}>{formatMoney(c.received)}</td>
                    <td style={{ color: isCleared ? '#16a34a' : '#dc2626', fontWeight: 800 }}>
                      {formatMoney(bal)}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${isCleared ? 'badge-success' : 'badge-danger'}`}>
                        {isCleared ? 'Cleared' : 'Due'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                <td colSpan={4} style={{ padding: '12px 14px' }}>GRAND TOTALS:</td>
                <td>{formatMoney(totalGross)}</td>
                <td style={{ color: '#d97706' }}>- {formatMoney(totalDiscount)}</td>
                <td>{formatMoney(netAmount)}</td>
                <td style={{ color: '#16a34a' }}>{formatMoney(totalReceived)}</td>
                <td style={{ color: '#dc2626' }}>{formatMoney(totalClearBalance)}</td>
                <td className="text-center">
                  <span className="badge badge-info">{clients.length} Clients</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
