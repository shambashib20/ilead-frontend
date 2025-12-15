import { ApiClient } from "@/services/ApiClient.service";
import axios from "axios";

export interface WapMonkeyPayload {
  wapmonkey_key: string;
}

interface WapmonkeyResponse {
  message: string;
  status: string;
  data: string;
}

interface SingleEntry {
  d_id: number,
  u_id: number
  mobile_no: string,
  status: number,
  connectionId: string,
  old_connection_id: string,
  u_device_token: string,
  device_name: string,
  host_device: string,
  created_at: string,
  updated_at: string,
  is_meta_device: string,
  device_status: string
}

interface WapmonkeyUserObject {
  u_id: number,
  name: string,
  mobile: string,
  password: string,
  address: string,
  company_name: string,
  gst_no: null,
  country: string,
  profileimg: null,
  auth_token: string,
  firebase_token: null,
  api_key: string,
  wallet: number,
  temp_wallet: number,
  status: number,
  u_type: number,
  otp: null,
  register_otp: string,
  is_otp_verified: number,
  device_limit: number,
  default_device_limit: number,
  waba_id: null,
  fb_access_token: null,
  p_template: number,
  p_customer: number,
  p_broadcast: number,
  p_customer_label: number,
  p_quick_reply: number,
  parent_u_id: number,
  time_zone: string,
  is_meta_allow: number,
  waba_p_id: null,
  w_p_p_id: null,
  u_storage: number,
  low_credit_message_send: number,
  d_status: number,
  created_at: string,
  updated_at: string
}

interface WapmonkeyUserResponse {
  status: number;
  description: string;
  data: WapmonkeyUserObject;
}



interface WapmonkeyDevicesResponse {
  message: string;
  status: string;
  data: SingleEntry[];
}

const wapmonkeyApi = import.meta.env.VITE_WAPMONKEY_API_URL as string;

export class WapmonkeyService extends ApiClient {
  constructor() {
    super("wapmonkey");
  }

  async createWapmonkeyEntry(
    payload: WapMonkeyPayload
  ): Promise<WapmonkeyResponse> {
    const res = await this.post<WapmonkeyResponse>("/enter-api", payload);
    return res.data;
  }


  async getWapmonkeyApiCount(apiKey: string): Promise<WapmonkeyUserResponse> {
    const res = await axios.post(
      `${wapmonkeyApi}/remaining-credit-api`,
      {},
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    return res.data;
  }


  async getWpamonkeyDevices(apiKey: string): Promise<WapmonkeyDevicesResponse> {
    const res = await axios.post(
      `${wapmonkeyApi}/v1/getuserdeviceapi`,
      {},
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    return res.data;
  }

}

export const wapmonkeyService = new WapmonkeyService();
