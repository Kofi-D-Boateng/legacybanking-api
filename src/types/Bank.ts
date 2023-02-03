export type Branch = {
  name: string;
  country: string;
  state: string;
  zipcode: string;
  totalHoldings: number;
  latitude: number;
  longitude: number;
};

export type Bank = {
  name: string;
  country: string;
  area: string;
  zipcode: string;
  totalHoldings: number;
  branches: Branch[];
};
