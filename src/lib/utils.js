import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Small utility functions.
 *
 * This module exists mainly as the target of our first unit test, to
 * demonstrate the testing setup. Add real helpers here as the app grows.
 */

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Add two numbers together.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function sum(a, b) {
  return a + b
}
