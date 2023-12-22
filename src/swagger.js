import { env } from './config/env.js'
import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    version: '0.0.1',
    title: 'StartWars API',
    description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.',
  },
  host: env.HOST,
  basePath: '/api',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/routes/import.js', './src/routes/personagens.js']

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  //require('./src/index') // Your project's root file
})
