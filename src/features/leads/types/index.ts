export interface Lead {
  _id: string;
  title: string;
  reference: string;
  name: string;
  phone_number: string;
  createdAt: string;
  meta: {
    ray_id: string; // Assuming ray_id is a string, adjust if necessary
  };
  assigned_to: {
    name: String; // Keep as String (capital S) to match your API
  };
  status: {
    _id: string;
  };
  comment: string;
  assigned_by: string;
  labels: Label[];
}

export interface Status {
  _id: string;
  title: string;
}

export interface Label {
  title: string;
}
