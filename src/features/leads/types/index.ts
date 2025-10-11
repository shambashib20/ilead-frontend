export interface Lead {
  follow_ups: any;
  meta?: Record<string, any>;
  address: string;
  email: string;
  missedFollowup?: boolean;
  company_name: string;
  _id: string;
  title: string;
  reference: string;
  name: string;
  phone_number: string;
  createdAt: string;
  assigned_to: { name: string };
  status: {
    _id: string;
    title: string;
  };
  comment: string;
  assigned_by: { name: string };
  labels: Label[];
}

export interface Status {
  _id: string;
  title: string;
  meta: { color_code: string };
}

export interface Label {
  _id: string;
  title: string;
  meta: {
    color_code: string;
  };
}
