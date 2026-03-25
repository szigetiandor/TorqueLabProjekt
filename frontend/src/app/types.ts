export interface CAR {
  id: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  passengerCapacity: number;
  status: string;
  engineType: string;
}

export interface ApiResponse {
  success: boolean;
  data?: CAR[];
  error?: string;
}