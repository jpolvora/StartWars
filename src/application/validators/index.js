import Validator from 'fastest-validator'

export class ValidatorId {
  constructor() {
    const validator = new Validator()

    const schema = {
      id: { type: 'uuid' },
    }

    this.validate = validator.compile(schema)
  }
}
