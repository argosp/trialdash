import { NUM_OF_DECIMAL_DIGITS } from './constants';

export default function processingDecimalDigits(decimalNumber) {
  return decimalNumber.toFixed(NUM_OF_DECIMAL_DIGITS);
}
