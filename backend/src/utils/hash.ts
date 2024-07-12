import { hash, compare } from 'bcryptjs';

export const createHash = (value: string): Promise<string> => {
  return hash(value, 10);
};

export const compareHash = (value: string, hash: string): Promise<boolean> => {
  return compare(value, hash);
};
