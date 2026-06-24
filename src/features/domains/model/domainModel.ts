import type { Domain } from './types';

export class DomainModel implements Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdDate: number;
  _id?: string;

  constructor(data: any) {
    this.id = data.id;
    this.domain = data.domain || 'بدون نام';
    this.status = data.status || 'pending';
    this.isActive = data.isActive ?? false;

    const dateVal = data.createdDate;
    if (typeof dateVal === 'number') {
      this.createdDate = dateVal;
    } else if (dateVal) {
      const num = Number(dateVal);
      if (!isNaN(num)) {
        this.createdDate = num;
      } else {
        const parsed = Date.parse(dateVal);
        this.createdDate = isNaN(parsed) ? Date.now() : parsed;
      }
    } else {
      this.createdDate = Date.now();
    }

    if (data._id) {
      this._id = data._id;
    }
  }

  static fromJson(json: any): DomainModel {
    return new DomainModel(json);
  }
}
