import Validator from 'fastest-validator'

export class ValidatorUUID {
  #validator

  constructor() {
    const validator = new Validator()

    const schema = {
      uuid: { type: 'uuid' },
    }

    this.#validator = validator.compile(schema)
  }

  async validate(input) {
    const validationResult = await this.#validator(input)
    if (typeof validationResult === 'boolean' && !!validationResult) return true

    const errorMessage = validationResult.map((e) => e.message).reduce((prev, curr) => `${prev}, ${curr}`)

    throw new Error(`Validation Error: ${errorMessage}`)
  }
}
