export default function calculateQuantities(selectedValues) {
  // Filter the keys of selectedValues that have a value of 'center'
  const plusKeys = Object.keys(selectedValues).filter(
    (key) => selectedValues[key] === 'center',
  );

  // Filter the keys of selectedValues that have a value of 'right'
  const minusKeys = Object.keys(selectedValues).filter(
    (key) => selectedValues[key] === 'right',
  );

  // Calculate the sum of plus and minus values based on the selected keys
  const plusSum = plusKeys.length;
  const minusSum = minusKeys.length;

  return {
    plus: plusSum,
    minus: minusSum,
  };
}
