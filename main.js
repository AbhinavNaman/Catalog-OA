const fs = require('fs');
const { parse } = require('json5');

function decodeValue(base, encodedValue) {
  return parseInt(encodedValue, parseInt(base));
}

function lagrangeInterpolation(xValues, yValues, x) {
  let result = 0;
  const n = xValues.length;

  for (let i = 0; i < n; i++) {
    let term = yValues[i];
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        term = term * (x - xValues[j]) / (xValues[i] - xValues[j]);
      }
    }
    result += term;
  }
  return result;
}

function getPolynomialCoefficients(xValues, yValues) {
  return yValues.map((_, idx) => lagrangeInterpolation(xValues, yValues, idx));
}

function main(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    const jsonData = parse(data);
    return processData(jsonData);
  } catch (error) {
    console.error(`Error reading file "${fileName}": ${error.message}`);
    return null;
  }
}

function processData(jsonData) {
  const n = jsonData.keys.n;
  const k = jsonData.keys.k;

  const xValues = [];
  const yValues = [];

  for (const key in jsonData) {
    if (key !== 'keys') {
      const { base, value } = jsonData[key];
      const x = parseInt(key, 10);
      const y = decodeValue(base, value);

      xValues.push(x);
      yValues.push(y);
    }
  }

  if (xValues.length < k) {
    throw new Error('Not enough roots');
  }

  const coefficients = getPolynomialCoefficients(xValues, yValues);
  const constantTerm = coefficients[0];

  return constantTerm;
}

const fileName = 'input2.json';

try {
  const constantTerm = main(fileName);
  if (constantTerm !== null) {
    console.log(constantTerm);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
}