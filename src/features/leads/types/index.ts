export interface Lead {
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
  meta: { ray_id: string };
  labels: Label[];
}

export interface Status {
  _id: string;
  title: string;
}

export interface Label {
  title: string;
}
