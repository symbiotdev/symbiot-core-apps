export type BrandEmployee = {
  id: string;
  about: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
  name: string;
  position: string;
  permissions: BrandEmployeePermissions;
};

export type BrandEmployeePermissions = {
  all: boolean;
  brandAll: boolean;
  analyticsAll: boolean;
  servicesAll: boolean;
  clientsAll: boolean;
  employeesAll: boolean;
  locationsAll: boolean;
};
