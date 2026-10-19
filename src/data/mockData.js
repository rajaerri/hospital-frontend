// Sample Mock Data for Life Care Hospital (Used before backend connection)

export const sampleDepartments = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
  "Dermatology"
];

export const sampleDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    qualification: "MBBS, MD (Cardiology)",
    experience: "12 years",
    roomNo: "Room 204, Block A",
    fee: "$50",
    availableDays: "Mon, Wed, Fri",
    rating: "4.9",
    avatarBg: "#0284c7"
  },
  {
    id: 2,
    name: "Dr. Robert Chen",
    specialty: "Neurology",
    qualification: "MBBS, DM (Neurology)",
    experience: "15 years",
    roomNo: "Room 310, Block B",
    fee: "$65",
    availableDays: "Tue, Thu, Sat",
    rating: "4.8",
    avatarBg: "#0f766e"
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    specialty: "Pediatrics",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: "8 years",
    roomNo: "Room 105, Child Care Wing",
    fee: "$40",
    availableDays: "Mon to Sat",
    rating: "5.0",
    avatarBg: "#d97706"
  },
  {
    id: 4,
    name: "Dr. Michael Adams",
    specialty: "Orthopedics",
    qualification: "MBBS, MS (Orthopedics)",
    experience: "14 years",
    roomNo: "Room 215, Block A",
    fee: "$55",
    availableDays: "Mon, Wed, Thu",
    rating: "4.7",
    avatarBg: "#4f46e5"
  },
  {
    id: 5,
    name: "Dr. Priya Patel",
    specialty: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: "10 years",
    roomNo: "Room 102, OPD Clinic",
    fee: "$35",
    availableDays: "Mon to Fri",
    rating: "4.9",
    avatarBg: "#059669"
  },
  {
    id: 6,
    name: "Dr. David Miller",
    specialty: "Dermatology",
    qualification: "MBBS, MD (Dermatology)",
    experience: "9 years",
    roomNo: "Room 304, Block C",
    fee: "$45",
    availableDays: "Tue, Fri, Sat",
    rating: "4.8",
    avatarBg: "#9333ea"
  }
];

export const initialAppointments = [
  {
    id: "APT-101",
    doctorId: 1,
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    date: "2026-10-14",
    time: "10:30 AM",
    status: "CONFIRMED",
    roomNo: "Room 204, Block A",
    reason: "Annual Heart Checkup"
  },
  {
    id: "APT-102",
    doctorId: 3,
    doctorName: "Dr. Emily Watson",
    specialty: "Pediatrics",
    date: "2026-10-18",
    time: "02:00 PM",
    status: "PENDING",
    roomNo: "Room 105, Child Care Wing",
    reason: "Seasonal Flu Follow-up"
  },
  {
    id: "APT-103",
    doctorId: 5,
    doctorName: "Dr. Priya Patel",
    specialty: "General Medicine",
    date: "2026-09-28",
    time: "11:00 AM",
    status: "COMPLETED",
    roomNo: "Room 102, OPD Clinic",
    reason: "Routine Blood Work Review"
  }
];

export const defaultPatientProfile = {
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 234-5678",
  age: "28",
  gender: "Male",
  bloodGroup: "O+",
  emergencyContact: "+1 (555) 987-6543 (Sibling)",
  address: "742 Evergreen Terrace, Springfield",
  medicalHistory: "Mild seasonal allergies. No chronic illnesses."
};
