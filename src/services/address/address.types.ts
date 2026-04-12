export interface AddressCoordinates {
  lat: number;
  lng: number;
}

export interface CreateAddressRequestBody {
  label: string;
  type: 'home' | 'work' | 'other';
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  coordinates: AddressCoordinates;
  instructions: string;
  isDefault: boolean;
}

export interface AddressEntity {
  userId: string;
  label: string;
  type: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  coordinates: AddressCoordinates;
  isDefault: boolean;
  instructions: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateAddressResponseBody {
  success: boolean;
  message: string;
  data: AddressEntity;
}

export interface ListAddressesResponseBody {
  success: boolean;
  data: AddressEntity[];
}
