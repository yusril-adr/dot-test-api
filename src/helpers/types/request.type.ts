import { JWTPayload } from './jwt-payload.type';

export type RequestUser = {
  user: JWTPayload;
  token: string;
};
