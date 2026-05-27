import { apiClient } from "@/services/api/http";
import { DELIVERY_ENDPOINTS } from "@/services/api/endpoints";

export interface DeliveryCoverageResult {
  covered: boolean;
  zone: string;
}

export interface DeliveryCoverageResponse {
  success: boolean;
  data: DeliveryCoverageResult;
}

export async function checkDeliveryCoverage(
  lat: number,
  lng: number
): Promise<DeliveryCoverageResponse> {
  const { data } = await apiClient.post<DeliveryCoverageResponse>(
    DELIVERY_ENDPOINTS.CHECK_COVERAGE,
    { lat, lng }
  );
  return data;
}
