import type {
  AdminCustomer,
  AdminOrder,
  AdminRider,
  AdminReview,
  AdminVendor,
} from "@/components/admin/admin-types";

export const mockCustomers: AdminCustomer[] = [
  {
    id: "cus_001",
    name: "Deee Babaa",
    email: "tstundes@gmail.com",
    phone: "07060761165",
    status: "active",
    createdAt: "2026-04-21",
    lastActiveAt: "2026-04-26",
    ordersCount: 3,
    totalSpent: 24500,
    rating: 4.5,
    profile: {
      preferences: {
        notifications: { email: true, sms: true, push: true },
        language: "en",
        currency: "USD",
      },
      lastKnownAddress: "Ikeja, Lagos",
    },
  },
  {
    id: "cus_002",
    name: "Amina Yusuf",
    email: "amina@example.com",
    status: "blocked",
    createdAt: "2026-03-12",
    lastActiveAt: "2026-04-10",
    ordersCount: 1,
    totalSpent: 5000,
    rating: 3.8,
    profile: {
      preferences: {
        notifications: { email: true, sms: false, push: true },
        language: "en",
        currency: "USD",
      },
      lastKnownAddress: "Gwarinpa, Abuja",
    },
  },
];

export const mockVendors: AdminVendor[] = [
  {
    id: "ven_001",
    businessName: "Day by Day Mart",
    ownerName: "Samuel Okafor",
    email: "vendor@example.com",
    status: "active",
    createdAt: "2026-02-05",
    verificationStatus: "pending",
    submittedAt: "2026-02-06",
    productsCount: 12,
    averageRating: 4.2,
    onboarding: {
      owner: { firstName: "Samuel", lastName: "Okafor", email: "vendor@example.com" },
      business: {
        businessName: "Day by Day Mart",
        category: "supermarket",
        phone: "08030000000",
        contactEmail: "support@daybyday.example",
        legalName: "Day by Day Mart Limited",
        isBusinessRegistered: true,
        address: {
          addressLine1: "12 Market Road",
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
          postalCode: "100001",
        },
      },
      verification: {
        businessSize: "Medium",
        logoUrl: "/images/logo.svg",
        registrationCertificateUrl: "/docs/vendor-registration-sample.pdf",
        bankAccount: {
          accountNumber: "0123456789",
          bankName: "Access Bank",
          accountHolderName: "Day by Day Mart Limited",
        },
      },
      operatingHours: [
        { day: 0, open: "08:00", close: "20:00", isClosed: false },
        { day: 1, open: "08:00", close: "20:00", isClosed: false },
        { day: 2, open: "08:00", close: "20:00", isClosed: false },
        { day: 3, open: "08:00", close: "20:00", isClosed: false },
        { day: 4, open: "08:00", close: "22:00", isClosed: false },
        { day: 5, open: "08:00", close: "22:00", isClosed: false },
        { day: 6, open: "10:00", close: "18:00", isClosed: false },
      ],
    },
  },
  {
    id: "ven_002",
    businessName: "Fresh Market Plus",
    ownerName: "Grace Bello",
    email: "fresh@example.com",
    status: "active",
    createdAt: "2026-01-22",
    verificationStatus: "verified",
    submittedAt: "2026-01-23",
    verifiedAt: "2026-01-25",
    productsCount: 40,
    averageRating: 4.7,
    onboarding: {
      owner: { firstName: "Grace", lastName: "Bello", email: "fresh@example.com" },
      business: {
        businessName: "Fresh Market Plus",
        category: "supermarket",
        phone: "08021110000",
        contactEmail: "hello@freshmarket.example",
        legalName: "Fresh Market Plus",
        isBusinessRegistered: false,
        address: {
          addressLine1: "8 Unity Avenue",
          city: "Abuja",
          state: "FCT",
          country: "Nigeria",
          postalCode: "900001",
        },
      },
      verification: {
        businessSize: "Large",
        logoUrl: "/images/logo.svg",
        bankAccount: {
          accountNumber: "1111222233",
          bankName: "GTBank",
          accountHolderName: "Fresh Market Plus",
        },
      },
      operatingHours: [
        { day: 0, open: "08:00", close: "20:00", isClosed: false },
        { day: 1, open: "08:00", close: "20:00", isClosed: false },
        { day: 2, open: "08:00", close: "20:00", isClosed: false },
        { day: 3, open: "08:00", close: "20:00", isClosed: false },
        { day: 4, open: "08:00", close: "22:00", isClosed: false },
        { day: 5, open: "08:00", close: "22:00", isClosed: false },
        { day: 6, open: "10:00", close: "18:00", isClosed: false },
      ],
    },
  },
];

export const mockRiders: AdminRider[] = [
  {
    id: "rid_001",
    name: "David James",
    email: "rider@example.com",
    status: "active",
    createdAt: "2026-03-01",
    verificationStatus: "pending",
    submittedAt: "2026-03-02",
    deliveriesCount: 18,
    averageRating: 4.4,
    onboarding: {
      basic: {
        firstName: "David",
        lastName: "James",
        email: "rider@example.com",
        phone: "08040001111",
      },
      profile: {
        vehicleType: "motorcycle",
        licenseUrl: "/docs/rider-license-sample.pdf",
        photoUrl: "/images/logo.svg",
        bankAccount: {
          accountNumber: "2222333344",
          bankName: "UBA",
          bankCode: "033",
          accountHolderName: "David James",
        },
      },
    },
  },
  {
    id: "rid_002",
    name: "Fatima Ali",
    email: "fatima@example.com",
    status: "active",
    createdAt: "2026-02-18",
    verificationStatus: "verified",
    submittedAt: "2026-02-19",
    verifiedAt: "2026-02-20",
    deliveriesCount: 62,
    averageRating: 4.9,
    onboarding: {
      basic: {
        firstName: "Fatima",
        lastName: "Ali",
        email: "fatima@example.com",
        phone: "08050002222",
      },
      profile: {
        vehicleType: "car",
        licenseUrl: "/docs/rider-license-sample.pdf",
        photoUrl: "/images/logo.svg",
        bankAccount: {
          accountNumber: "5555666677",
          bankName: "Zenith Bank",
          bankCode: "057",
          accountHolderName: "Fatima Ali",
        },
      },
    },
  },
];

export const mockOrders: AdminOrder[] = [
  {
    id: "ord_1001",
    customerName: "Deee Babaa",
    vendorName: "Day by Day Mart",
    total: 12500,
    status: "delivered",
    createdAt: "2026-04-26",
  },
  {
    id: "ord_1002",
    customerName: "Amina Yusuf",
    vendorName: "Fresh Market Plus",
    total: 5000,
    status: "cancelled",
    createdAt: "2026-04-10",
  },
];

export const mockReviews: AdminReview[] = [
  {
    id: "rev_01",
    authorName: "Deee Babaa",
    target: "vendor",
    targetName: "Fresh Market Plus",
    rating: 5,
    comment: "Fast delivery and fresh items.",
    createdAt: "2026-04-26",
  },
  {
    id: "rev_02",
    authorName: "Amina Yusuf",
    target: "rider",
    targetName: "David James",
    rating: 3,
    comment: "Arrived late but was polite.",
    createdAt: "2026-04-10",
  },
];

