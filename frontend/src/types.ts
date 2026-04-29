export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Staff {
  id: number;
  user_id: number;
  user?: User;
  position: string;
  phone: string;
  address: string;
  hire_date: string;
  salary: number;
  created_at?: string;
  updated_at?: string;
}

export interface StaffAttendance {
  id: number;
  staff_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'sick';
  check_in?: string;
  check_out?: string;
  notes?: string;
}

export interface StaffPayroll {
  id: number;
  staff_id: number;
  month: number;
  year: number;
  base_salary: number;
  bonus: number;
  deductions: number;
  total: number;
  status: 'draft' | 'approved' | 'paid';
  paid_at?: string;
  notes?: string;
}

export interface StaffPerformanceReview {
  id: number;
  staff_id: number;
  reviewer_id: number;
  reviewer?: User;
  review_date: string;
  rating: number;
  strengths?: string;
  areas_for_improvement?: string;
  goals?: string;
  comments?: string;
}

export interface Orphan {
  id: number;
  code: string;
  name: string;
  gender: 'male' | 'female';
  birth_date: string;
  religion: string;
  parent_status: string;
  entry_date: string;
  status: 'active' | 'inactive';
  address_origin?: string;
  health_notes?: string;
  education_level?: string;
  photo?: string;
  medical_records?: OrphanMedicalRecord[];
  education_records?: OrphanEducationRecord[];
  family_contacts?: OrphanFamilyContact[];
}

export interface OrphanMedicalRecord {
  id: number;
  orphan_id: number;
  date: string;
  doctor_name?: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface OrphanEducationRecord {
  id: number;
  orphan_id: number;
  school_name: string;
  grade_class: string;
  academic_year: string;
  semester: '1' | '2';
  status: 'active' | 'completed' | 'dropped';
  notes?: string;
}

export interface OrphanFamilyContact {
    id: number;
    orphan_id: number;
    name: string;
    relationship: string;
    phone?: string;
    address?: string;
    email?: string;
    is_primary_contact: boolean;
    notes?: string;
}

export interface Donation {
    id: number;
    donor_name: string;
    donor_email?: string;
    donor_phone?: string;
    amount: number;
    type: 'cash' | 'goods';
    description?: string;
    receipt_no: string;
    date_received: string;
    staff_id: number;
    staff?: {
        id: number;
        user_id: number;
        user?: {
            id: number;
            name: string;
            email: string;
            role: 'admin' | 'staff';
        };
        position: string;
        phone: string;
        address: string;
        hire_date: string;
        salary: number;
    };
    created_at?: string;
    updated_at?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
}

