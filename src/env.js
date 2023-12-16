import { cleanEnv, str, num } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: num(),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  AMQP_URL: str(),
  MONGODB_URI: str(),
})
