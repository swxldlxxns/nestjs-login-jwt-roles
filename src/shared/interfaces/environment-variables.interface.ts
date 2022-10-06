export interface EnvironmentVariables {
  database: {
    dbName: string;
    user: string;
    pass: string;
    port: number;
    host: string;
    connection: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}
