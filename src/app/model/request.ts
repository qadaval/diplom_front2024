export interface Request {
  id?: number;
  dateOfRequest?: Date;
  parentId?: number;
  childId?: number;
  daycareId?: string;
  approved?: boolean;
}
