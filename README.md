# usmannaimat-client-managment

An Enterprise Umrah Client Management System & Agency Dashboard built with **Next.js (App Router, React, TypeScript)** and **Firebase (Cloud Firestore)**.

## 🕌 Features

- **Full Pilgrim Data Tracking**:
  - Serial No Count
  - Name & Father/Husband Name
  - Mobile / WhatsApp Number
  - National ID Card (CNIC) & Passport Number
  - Travel Dates (In / Out) & Total Days (auto-computed)
  - Flight Logistics: Airline, Departure & Arrival Airports
  - Hotel Accommodations: Makkah Stay, Medinah Stay, Room Category (Sharing, Quad, Triple, Double, Single), Meal Plan (Room Only, BB, Half Board, Full Board)
  - Visa & Ground Transport: Visa Type, Visa Number, MoFA Application Number, Vehicle Category
  - Ziyarah Itineraries
  - Live Financials & Clear Balance: $\text{Clear Balance} = \text{Total Amount} - \text{Discount} - \text{Received}$

- **B2B Agency & Supplier Tracking**:
  - Umrah Full Package Travel Agency Name
  - Ticket Agency Name
  - Visa Agency Name
  - Transport Agency Name
  - Hotel Agency Name

- **Print-Ready Umrah Booking Voucher & Official Invoice**:
  - Formatted A4 printable confirmation voucher with Bismillah, agency branding, QR/seal areas, flight schedule, hotel stay details, and complete financial payment breakdown.

- **Cloud & Offline Sync**:
  - Integrated with **Firebase Cloud Firestore** for real-time multi-device cloud synchronization.
  - Automatic **Local Storage** fallback for offline operation.

- **Data Portability**:
  - Export to **Excel / CSV** format.
  - Full **JSON Data Backup** & **Restore**.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port 3001 if 3000 is occupied) in your browser.

### 3. Connect Firebase (Optional)
Click the **"Firebase Setup"** button in the dashboard top navigation bar to enter your Firebase project credentials.
