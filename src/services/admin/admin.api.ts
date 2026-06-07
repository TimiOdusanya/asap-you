import { apiClient } from "@/services/api/http";
import { ADMIN_ENDPOINTS, SETTINGS_ENDPOINTS } from "@/services/api/endpoints";
import type {
  AdminDashboardData,
  AdminPaginatedOrders,
  AdminPaginatedReviews,
  AdminPaginatedRiders,
  AdminPaginatedUsers,
  AdminPaginatedVendors,
  AdminRiderDetailData,
  AdminRiderRecord,
  AdminReviewRecord,
  AdminUserDetailData,
  AdminUserRecord,
  AdminVendorDetailData,
  AdminVendorRecord,
} from "@/types/admin-api";
import type { StoreSettingsDto } from "@/services/store/settings.api";

export interface ControllerResponse<T> {
  message: string;
  data: T;
}

export type AdminQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
  status?: string;
  category?: string;
};

export interface UpdateAdminUserPayload {
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface UpdateAdminVendorPayload {
  isActive?: boolean;
  isOpen?: boolean;
  isVerified?: boolean;
  documentIndex?: number;
  documentStatus?: string;
  reviewNotes?: string;
}

export interface UpdateAdminRiderPayload {
  isActive?: boolean;
}

export interface UpdateAdminReviewPayload {
  isActive: boolean;
}

export interface UpdateStoreSettingsPayload {
  deliveryFee?: number;
  serviceChargeRate?: number;
  minOrderAmount?: number;
  maxDeliveryDistance?: number;
  currency?: string;
}

export const adminDashboardQueryKey = ["admin", "dashboard"] as const;
export const adminUsersQueryKey = (params?: AdminQueryParams) =>
  ["admin", "users", params ?? {}] as const;
export const adminUserQueryKey = (userId: string) => ["admin", "users", userId] as const;
export const adminVendorsQueryKey = (params?: AdminQueryParams) =>
  ["admin", "vendors", params ?? {}] as const;
export const adminVendorQueryKey = (vendorId: string) => ["admin", "vendors", vendorId] as const;
export const adminRidersQueryKey = (params?: AdminQueryParams) =>
  ["admin", "riders", params ?? {}] as const;
export const adminRiderQueryKey = (riderId: string) => ["admin", "riders", riderId] as const;
export const adminOrdersQueryKey = (params?: AdminQueryParams) =>
  ["admin", "orders", params ?? {}] as const;
export const adminReviewsQueryKey = (params?: AdminQueryParams) =>
  ["admin", "reviews", params ?? {}] as const;
export const adminStoreSettingsQueryKey = ["admin", "store-settings"] as const;

export async function fetchAdminDashboard(): Promise<ControllerResponse<AdminDashboardData>> {
  const { data } = await apiClient.get<ControllerResponse<AdminDashboardData>>(
    ADMIN_ENDPOINTS.DASHBOARD
  );
  return data;
}

export async function fetchAdminUsers(
  params?: AdminQueryParams
): Promise<ControllerResponse<AdminPaginatedUsers>> {
  const { data } = await apiClient.get<ControllerResponse<AdminPaginatedUsers>>(
    ADMIN_ENDPOINTS.USERS,
    { params }
  );
  return data;
}

export async function fetchAdminUser(userId: string): Promise<ControllerResponse<AdminUserDetailData>> {
  const { data } = await apiClient.get<ControllerResponse<AdminUserDetailData>>(
    ADMIN_ENDPOINTS.userById(userId)
  );
  return data;
}

export async function updateAdminUser(
  userId: string,
  payload: UpdateAdminUserPayload
): Promise<ControllerResponse<AdminUserRecord>> {
  const { data } = await apiClient.patch<ControllerResponse<AdminUserRecord>>(
    ADMIN_ENDPOINTS.userById(userId),
    payload
  );
  return data;
}

export async function fetchAdminVendors(
  params?: AdminQueryParams
): Promise<ControllerResponse<AdminPaginatedVendors>> {
  const { data } = await apiClient.get<ControllerResponse<AdminPaginatedVendors>>(
    ADMIN_ENDPOINTS.VENDORS,
    { params }
  );
  return data;
}

export async function fetchAdminVendor(
  vendorId: string
): Promise<ControllerResponse<AdminVendorDetailData>> {
  const { data } = await apiClient.get<ControllerResponse<AdminVendorDetailData>>(
    ADMIN_ENDPOINTS.vendorById(vendorId)
  );
  return data;
}

export async function updateAdminVendor(
  vendorId: string,
  payload: UpdateAdminVendorPayload
): Promise<ControllerResponse<AdminVendorRecord>> {
  const { data } = await apiClient.patch<ControllerResponse<AdminVendorRecord>>(
    ADMIN_ENDPOINTS.vendorById(vendorId),
    payload
  );
  return data;
}

export async function fetchAdminRiders(
  params?: AdminQueryParams
): Promise<ControllerResponse<AdminPaginatedRiders>> {
  const { data } = await apiClient.get<ControllerResponse<AdminPaginatedRiders>>(
    ADMIN_ENDPOINTS.RIDERS,
    { params }
  );
  return data;
}

export async function fetchAdminRider(
  riderId: string
): Promise<ControllerResponse<AdminRiderDetailData>> {
  const { data } = await apiClient.get<ControllerResponse<AdminRiderDetailData>>(
    ADMIN_ENDPOINTS.riderById(riderId)
  );
  return data;
}

export async function updateAdminRider(
  riderId: string,
  payload: UpdateAdminRiderPayload
): Promise<ControllerResponse<AdminRiderRecord>> {
  const { data } = await apiClient.patch<ControllerResponse<AdminRiderRecord>>(
    ADMIN_ENDPOINTS.riderById(riderId),
    payload
  );
  return data;
}

export async function fetchAdminOrders(
  params?: AdminQueryParams
): Promise<ControllerResponse<AdminPaginatedOrders>> {
  const { data } = await apiClient.get<ControllerResponse<AdminPaginatedOrders>>(
    ADMIN_ENDPOINTS.ORDERS,
    { params }
  );
  return data;
}

export async function fetchAdminReviews(
  params?: AdminQueryParams
): Promise<ControllerResponse<AdminPaginatedReviews>> {
  const { data } = await apiClient.get<ControllerResponse<AdminPaginatedReviews>>(
    ADMIN_ENDPOINTS.REVIEWS,
    { params }
  );
  return data;
}

export async function updateAdminReview(
  reviewId: string,
  payload: UpdateAdminReviewPayload
): Promise<ControllerResponse<AdminReviewRecord>> {
  const { data } = await apiClient.patch<ControllerResponse<AdminReviewRecord>>(
    ADMIN_ENDPOINTS.reviewById(reviewId),
    payload
  );
  return data;
}

export async function fetchAdminStoreSettings(): Promise<{ success: boolean; data: StoreSettingsDto }> {
  const { data } = await apiClient.get<{ success: boolean; data: StoreSettingsDto }>(
    SETTINGS_ENDPOINTS.GET
  );
  return data;
}

export async function updateAdminStoreSettings(
  payload: UpdateStoreSettingsPayload
): Promise<{ success: boolean; message?: string; data: StoreSettingsDto }> {
  const { data } = await apiClient.patch<{
    success: boolean;
    message?: string;
    data: StoreSettingsDto;
  }>(SETTINGS_ENDPOINTS.GET, payload);
  return data;
}
