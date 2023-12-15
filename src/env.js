import 'dotenv/config.js'
import { cleanEnv, str, num } from 'envalid'

export const env = cleanEnv(process.env, {
  PORT: num(),
  //API_KEY: str(),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
})
