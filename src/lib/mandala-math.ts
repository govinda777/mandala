/**
 * Números de Fibonacci utilizados para restringir a contagem de pétalas.
 */
export const fibonacciNumbers = [3, 5, 8, 13, 21, 34, 55, 89];

/**
 * Encontra o número de Fibonacci mais próximo do valor fornecido.
 * @param n O número de entrada.
 * @returns O número de Fibonacci mais próximo.
 */
export const getNearestFibonacci = (n: number): number => {
  return fibonacciNumbers.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
};
