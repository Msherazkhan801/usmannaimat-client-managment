export type RoomType = 'Sharing' | 'Quad' | 'Triple' | 'Double' | 'Single';

export type VisaType = 
  | 'Umrah eVisa' 
  | 'Tourist eVisa' 
  | 'Transit / Stopover' 
  | 'Family Visit' 
  | 'Business / Work';

export type TransportType = 
  | 'VIP Sharing Bus (Circle)' 
  | 'Private Sedan (Camry/Sonata)' 
  | 'Private GMC / Yukon' 
  | 'Private HiAce (10-12 Seater)' 
  | 'Private Coaster (20-25 Seater)' 
  | 'Haramain High-Speed Train';

export type MealPlan = 
  | 'Room Only (No Meals)' 
  | 'Bed & Breakfast (BB)' 
  | 'Half Board (Breakfast + Dinner)' 
  | 'Full Board (B + L + D)';

export type PaymentStatus = 'Fully Paid' | 'Partial Balance' | 'Pending Payment';

export type TravelStatus = 'Upcoming' | 'In Makkah' | 'In Madinah' | 'Completed';

export interface ClientRecord {
  id?: string;
  serialNo: string;
  name: string;
  fatherOrHusbandName: string;
  mobileNumber: string;
  idCard: string;
  passport: string;
  days: number;
  travelDateIn: string;
  travelDateOut: string;
  airportIn: string;
  airportOut: string;
  airline: string;
  hotel: string;
  makkahStay: string;
  medinahStay: string;
  visaType: VisaType | string;
  visaNumber: string;
  applicationNumber: string;
  transportType: TransportType | string;
  roomType: RoomType | string;
  mealPlan: MealPlan | string;
  ziyarat: string;
  
  // Financials
  totalAmount: number;
  discount: number;
  received: number;
  clearBalance: number; // Computed: totalAmount - discount - received
  paymentStatus?: PaymentStatus;
  travelStatus?: TravelStatus;

  // Agency Partner Associations
  fullPackageAgencyName: string;
  ticketAgencyName: string;
  visaAgencyName: string;
  transportAgencyName: string;
  hotelAgencyName: string;

  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgencyConfig {
  fullPackageAgencyName: string;
  ticketAgencyName: string;
  visaAgencyName: string;
  transportAgencyName: string;
  hotelAgencyName: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
