export type LoginRequest = {
  email: string | undefined;
  password: string | undefined;
};

export type LoginRequestReturn = {
  ApiKey:string | undefined;
  AuthToken:string | undefined;
  TokenExpiration:number;
}
