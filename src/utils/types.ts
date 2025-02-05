export enum Role {
  Customer = "Customer",
  Seller = "Seller",
  Admin = "Admin",
}
export type User_t = {
  email: string;
  name: string;
  password: string;
  address: string;
  role?: Role;
};
export type GetUser_t = {
  email: string;
  name?: string;
  password?: string;
  address?: string;
  role?: Role;
};
