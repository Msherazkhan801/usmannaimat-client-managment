'use client';

import React from 'react';
import { ClientRecord } from '@/types';

interface FinancialHealthCardProps {
  clients: ClientRecord[];
  currencySymbol: string;
}

export default function FinancialHealthCard({ clients, currencySymbol }: FinancialHealthCardProps) {
  const totalGross = clients.reduce((acc, c) => acc + (Number(c.totalAmount) || 0), 0);
  const totalDiscount = clients.reduce((acc, c) => acc + (Number(c.discount) || 0), 0);
  const totalReceived = clients.reduce((acc, c) => acc + (Number(c.received) || 0), 0);
  const totalBalance = clients.reduce((acc, c) => acc + (Number(c.clearBalance) || 0), 0);

  const netAmount = totalGross - totalDiscount;

  const fullyPaidCount = clients.filter(c => (Number(c.clearBalance) || 0) <= 0 && (Number(c.totalAmount) || 0) > 0).length;
  const partialPaidCount = clients.filter(c => (Number(c.clearBalance) || 0) > 0 && (Number(c.received) || 0) > 0).length;
  const unpaidCount = clients.filter(c => (Number(c.received) || 0) === 0 && (Number(c.totalAmount) || 0) > 0).length;

  const avgPackage = clients.length > 0 ? Math.round(totalGross / clients.length) : 0;

  // Percentage segments
  const receivedPct = netAmount > 0 ? Math.min(100, Math.round((totalReceived / totalGross) * 100)) : 0;
  const discountPct = totalGross > 0 ? Math.round((totalDiscount / totalGross) * 100) : 0;
  const balancePct = Math.max(0, 100 - receivedPct - discountPct);

  const formatMoney = (val: number) => `${currencySymbol} ${val.toLocaleString('en-US')}`;

  const isHealthy = balancePct < 35;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-wrap">
          <h3 className="card-title">Payment & Collection Health</h3>
          <span className="card-subtitle">Real-time breakdown of Received vs Clear Balance</span>
        </div>
        <span className={`badge ${isHealthy ? 'badge-success' : 'badge-warning'}`}>
          {isHealthy ? 'Healthy Flow' : 'Follow Up Required'}
        </span>
      </div>

      <div className="card-body">
        <div className="financial-progress-bar-wrap">
          <div className="progress-bar-multi">
            <div 
              className="progress-segment received-seg" 
              style={{ width: `${receivedPct}%` }}
              title={`Received: ${receivedPct}%`}
            />
            <div 
              className="progress-segment discount-seg" 
              style={{ width: `${discountPct}%` }}
              title={`Discount: ${discountPct}%`}
            />
            <div 
              className="progress-segment balance-seg" 
              style={{ width: `${balancePct}%` }}
              title={`Balance Due: ${balancePct}%`}
            />
          </div>

          <div className="progress-legend">
            <span className="legend-item">
              <span className="legend-dot bg-emerald"></span> 
              Received: <b>{formatMoney(totalReceived)}</b>
            </span>
            <span className="legend-item">
              <span className="legend-dot bg-amber"></span> 
              Discounts: <b>{formatMoney(totalDiscount)}</b>
            </span>
            <span className="legend-item">
              <span className="legend-dot bg-danger"></span> 
              Clear Balance: <b>{formatMoney(totalBalance)}</b>
            </span>
          </div>
        </div>

        <div className="stat-mini-grid">
          <div className="mini-stat-box">
            <span className="mini-stat-label">Fully Paid</span>
            <span className="mini-stat-val text-success">{fullyPaidCount}</span>
          </div>
          <div className="mini-stat-box">
            <span className="mini-stat-label">Partial Balance</span>
            <span className="mini-stat-val text-warning">{partialPaidCount}</span>
          </div>
          <div className="mini-stat-box">
            <span className="mini-stat-label">Zero Payment</span>
            <span className="mini-stat-val text-danger">{unpaidCount}</span>
          </div>
          <div className="mini-stat-box">
            <span className="mini-stat-label">Average Package</span>
            <span className="mini-stat-val">{formatMoney(avgPackage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
