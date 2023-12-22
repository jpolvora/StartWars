export function adaptMessageToUseCase(container, useCaseKlass) {
  return async (msg) => {
    const useCase = new useCaseKlass(container)
    const output = await useCase.execute(msg)
    return output
  }
}
