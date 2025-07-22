export interface Lead {
  meta?: Record<string, any>;
  address: string;
  email: string;
  company_name: string;
  _id: string;
  title: string;
  reference: string;
  name: string;
  phone_number: string;
  createdAt: string;
  assigned_to: { name: string };
  status: { _id: string };
  comment: string;
  assigned_by: string;
  labels: Label[];
}

export interface Status {
  _id: string;
  title: string;
}

export interface Label {
  _id: string;
  title: string;
}
