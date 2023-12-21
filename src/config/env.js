import { cleanEnv, str, num, bool } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: num(),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  AMQP_URL: str(),
  MONGODB_URI: str(),
  MONGODB_DBNAME: str(),
  API_URL: str(),
  ENABLE_SWAGGER: bool(),
})
