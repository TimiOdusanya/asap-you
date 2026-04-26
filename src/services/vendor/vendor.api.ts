import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type {
  RegisterVendorPayload,
  RegisterVendorResponseBody,
  VendorLoginResponseBody,
} from "@/services/vendor/vendor.types";

export async function registerVendor(
  payload: RegisterVendorPayload
): Promise<RegisterVendorResponseBody> {
  const form = new FormData();

  form.append("email", payload.email);
  form.append("password", payload.password);
  form.append("phone", payload.phone);
  form.append("firstName", payload.firstName);
  form.append("lastName", payload.lastName);
  form.append("businessName", payload.businessName);
  form.append("category", payload.category);
  form.append("businessSize", payload.businessSize);
  form.append("isBusinessRegistered", payload.isBusinessRegistered);
  form.append("logo", payload.logo);

  form.append("bankAccount[accountNumber]", payload.bankAccount.accountNumber);
  form.append("bankAccount[bankName]", payload.bankAccount.bankName);
  form.append("bankAccount[accountHolderName]", payload.bankAccount.accountHolderName);

  form.append("businessInfo[legalName]", payload.businessInfo.legalName);
  form.append("businessInfo[contactEmail]", payload.businessInfo.contactEmail);
  form.append("businessInfo[contactPhone]", payload.businessInfo.contactPhone);
  form.append("businessInfo[taxId]", payload.businessInfo.taxId);

  form.append("address[addressLine1]", payload.address.addressLine1);
  form.append("address[city]", payload.address.city);
  form.append("address[state]", payload.address.state);
  form.append("address[country]", payload.address.country);
  form.append("address[postalCode]", payload.address.postalCode);

  if (payload.businessRegistrationCertificate) {
    form.append("businessRegistrationCertificate", payload.businessRegistrationCertificate);
  }

  form.append("operatingHours", JSON.stringify(payload.operatingHours));

  const { data } = await apiClient.post<RegisterVendorResponseBody>(
    VENDOR_ENDPOINTS.REGISTER,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}

export async function vendorLogin(
  email: string,
  password: string
): Promise<VendorLoginResponseBody> {
  const { data } = await apiClient.post<VendorLoginResponseBody>(
    VENDOR_ENDPOINTS.LOGIN,
    { email, password }
  );
  return data;
}
