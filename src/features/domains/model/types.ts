export interface Domain {
  id: string;
  domain: string;
  createdDate: number;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  _id?: string;
}
