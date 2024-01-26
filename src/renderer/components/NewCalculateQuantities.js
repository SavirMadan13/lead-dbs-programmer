export default function NewCalculateQuantities(selectedValues) {
  const plusValues = Object.values(selectedValues).filter(
    (value) => value === 'center',
  );
  const minusValues = Object.values(selectedValues).filter(
    (value) => value === 'right',
  );

  // Calculate the sum of plus and minus values
  const plusSum = plusValues.reduce((sum, quantities) => sum + quantities, 0);
  const minusSum = minusValues.reduce((sum, value) => sum + value, 0);

  return {
    plus: plusSum,
    minus: minusSum,
  };
}
