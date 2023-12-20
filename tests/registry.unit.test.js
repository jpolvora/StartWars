import 'dotenv/config'
import { Registry } from '../src/infra'

describe('Registry instance Unit tests', () => {
  it('should register singleton instance', () => {
    const sut = Registry.instance
    const service = () => {}
    sut.set('a', service)
    const resolved = sut.get('a')
    expect(resolved).toBe(resolved)
  })
})
