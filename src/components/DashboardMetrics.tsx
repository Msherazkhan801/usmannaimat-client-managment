'use client';

import React from 'react';
import { Users, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClientRecord } from '@/types';

interface DashboardMetricsProps {
  clients: ClientRecord[];
  currencySymbol: string;
}

export default function DashboardMetrics({ clients, currencySymbol }: DashboardMetricsProps) {
  const totalClients = clients.length;
  
  const totalGross = clients.reduce((acc, c) => acc + (Number(c.totalAmount) || 0), 0);
  const totalDiscount = clients.reduce((acc, c) => acc + (Number(c.discount) || 0), 0);
  const totalReceived = clients.reduce((acc, c) => acc + (Number(c.received) || 0), 0);
  const totalClearBalance = clients.reduce((acc, c) => acc + (Number(c.clearBalance) || 0), 0);

  const activeInSaudi = clients.filter(c => c.travelStatus === 'In Makkah' || c.travelStatus === 'In Madinah').length;
  const pendingBalanceClients = clients.filter(c => (Number(c.clearBalance) || 0) > 0).length;

  const netAmount = totalGross - totalDiscount;
  const collectionPercentage = netAmount > 0 ? Math.round((totalReceived / netAmount) * 100) : 0;

  const formatMoney = (val: number) => {
    return `${currencySymbol} ${val.toLocaleString('en-US')}`;
  };

  return (
    <div className="metrics-grid">
      {/* Total Pilgrims */}
      <div className="metric-card">
        <div className="metric-icon green">
          <Users size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Total Pilgrims</span>
          <h4 className="metric-value">{totalClients}</h4>
          <span className="metric-trend positive">
            {activeInSaudi} currently in Saudi Arabia
          </span>
        </div>
      </div>

      {/* Gross Bookings Value */}
      <div className="metric-card">
        <div className="metric-icon blue">
          <DollarSign size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Total Package Value</span>
          <h4 className="metric-value">{formatMoney(totalGross)}</h4>
          <span className="metric-trend neutral">
            Discounts: {formatMoney(totalDiscount)}
          </span>
        </div>
      </div>

      {/* Received Amount */}
      <div className="metric-card">
        <div className="metric-icon emerald">
          <CheckCircle2 size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Received (Collected)</span>
          <h4 className="metric-value">{formatMoney(totalReceived)}</h4>
          <span className="metric-trend positive">
            {collectionPercentage}% Collection Rate
          </span>
        </div>
      </div>

      {/* Clear Balance Due */}
      <div className="metric-card danger-card">
        <div className="metric-icon red">
          <AlertCircle size={24} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Clear Balance (Pending)</span>
          <h4 className="metric-value text-danger">{formatMoney(totalClearBalance)}</h4>
          <span className="metric-trend negative">
            {pendingBalanceClients} clients with balance due
          </span>
        </div>
      </div>
    </div>
  );
}
