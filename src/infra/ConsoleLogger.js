export class ConsoleLogger {
  error(...args) {
    console.error.bind(console).apply(args)
  }
}
