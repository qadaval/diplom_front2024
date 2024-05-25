import {Child} from './child';

export interface Parent {
  id?: number;
  name?: string;
  f_name?: string;
  surname?: string;
  iin?: string;
  password?: string;
  dateOfBirth?: Date;
  citizenship?: string;
  cityId?: number;
  gender?: string;
  phoneNumber?: string;
  children?: Child[];
  token?: string;
}
