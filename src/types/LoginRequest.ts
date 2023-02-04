export type LoginRequest = {
  email: string | undefined;
  password: string | undefined;
};

export type LoginRequestReturn = {
  apiKey:string | undefined;
  authorizationToken:string | undefined;
  isActivated:boolean;
  tokenExpiration:number;
}
