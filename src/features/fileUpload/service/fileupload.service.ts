import { ApiClient } from "@/services/ApiClient.service";

export interface UploadedFileData {
  file_url: string;
  file_id: string;
  name: string;
  type: string;
  uploaded_by: string | null;
  meta: {
    size: number;
    [key: string]: any;
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileResponse {
  message: string;
  data: UploadedFileData;
}

export class FileUploadService extends ApiClient {
  constructor() {
    super("file");
  }

  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await this.post<UploadFileResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data; // <- { message, data: { file_url, ... } }
  }
}

export const fileUploadService = new FileUploadService();
