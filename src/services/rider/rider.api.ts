import { apiClient } from "@/services/api/http";
import { RIDER_ENDPOINTS } from "@/services/api/endpoints";
import type {
  RegisterRiderPayload,
  RegisterRiderResponseBody,
  RiderLoginResponseBody,
} from "@/services/rider/rider.types";

export async function registerRider(
  payload: RegisterRiderPayload
): Promise<RegisterRiderResponseBody> {
  const form = new FormData();
  form.append("firstName", payload.firstName);
  form.append("lastName", payload.lastName);
  form.append("email", payload.email);
  form.append("phone", payload.phone);
  form.append("password", payload.password);
  form.append("vehicleType", payload.vehicleType);
  form.append("license", payload.license);
  form.append("photo", payload.photo);
  form.append(
    "bankAccount",
    JSON.stringify(payload.bankAccount)
  );

  const { data } = await apiClient.post<RegisterRiderResponseBody>(
    RIDER_ENDPOINTS.REGISTER,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function riderLogin(
  email: string,
  password: string
): Promise<RiderLoginResponseBody> {
  const { data } = await apiClient.post<RiderLoginResponseBody>(
    RIDER_ENDPOINTS.LOGIN,
    { email, password }
  );
  return data;
}
