decimal_box = document.getElementById("decimal");
binary_box = document.getElementById("binary");
u1_box = document.getElementById("u1");
u1_dropdown = document.getElementById("u1-dropdown");
u2_box = document.getElementById("u2");
u2_dropdown = document.getElementById("u2-dropdown"); 
oct_box = document.getElementById("oct");
hex_box = document.getElementById("hex");
float_box = document.getElementById("float32");
custom_box = document.getElementById("custom");
custom_size = document.getElementById("custom-size");

var input;

binary_box.addEventListener("input", function() {
    input = binary_box.value;
    if (input.length > 0) {
        input = baseToDecimal(input, 2);
        binary = input.toString(2);
        decimal_box.value = input;
        u1_box.value = toU1(binary, u1_dropdown.value);
        u2_box.value = toU2(binary, u2_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);
    } else {
        clear();
    }
});

decimal_box.addEventListener("input", function() {
    input = decimal_box.value;
    if (input.length > 0) {
        input = parseFloat(input);
        binary = input.toString(2);
        binary_box.value = input.toString(2);
        u1_box.value = toU1(binary, u1_dropdown.value);
        u2_box.value = toU2(binary, u2_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});

float_box.addEventListener("input", function() {
    input = float_box.value;
    if (input.length > 0) {
        input = binaryFloatToDecimal(input);
        binary = input.toString(2);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u1_box.value = toU1(binary, u1_dropdown.value);
        u2_box.value = toU2(binary, u2_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});

oct_box.addEventListener("input", function() { 
    input = oct_box.value;
    if (input.length > 0) {
        input = baseToDecimal(input, 8);
        binary = input.toString(2);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u1_box.value = toU1(binary, u1_dropdown.value);
        u2_box.value = toU2(binary, u2_dropdown.value);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});

hex_box.addEventListener("input", function() {
    input = hex_box.value;
    if (input.length > 0) {
        input = baseToDecimal(input, 16);
        binary = input.toString(2);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u1_box.value = toU1(binary, u1_dropdown.value);
        u2_box.value = toU2(binary, u2_dropdown.value);
        oct_box.value = input.toString(8);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});

u2_box.addEventListener("input", function() {
    input = u2_box.value;
    if (input.length > 0) {
        input = u2ToSigned(input, u2_dropdown.value);
        binary = input;
        input = binaryToDecimal(input);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u1_box.value = toU1(binary, u1_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});

u1_box.addEventListener("input", function() {
    input = u1_box.value;
    if (input.length > 0) {
        input = U1toSignedDec(input, u1_dropdown.value);
        binary = input.toString(2);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u2_box.value = toU2(input.toString(2), u2_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);
        custom_box.value = input.toString(custom_size.value);

    } else {
        clear();
    }
});


custom_box.addEventListener("input", function() {
    input = custom_box.value;
    if (input.length > 0) {
        input = baseToDecimal(input, custom_size.value);
        binary = input.toString(2);
        decimal_box.value = input;
        binary_box.value = input.toString(2);
        u1_box.value = toU1(input.toString(2), u1_dropdown.value)
        u2_box.value = toU2(input.toString(2), u2_dropdown.value);
        oct_box.value = input.toString(8);
        hex_box.value = input.toString(16);
        float_box.value = floatToBinary(input);

    } else {
        clear();
    }
});


function clear(){
    decimal.value = "";
    binary_box.value = "";
    u1_box.value = "";
    u2_box.value = "";
    oct_box.value = "";
    hex_box.value = "";
    float_box.value = "";
    custom_box.value = "";
}


function floatToBinary(floatValue) {
    var floatArray = new Float32Array(1);
    floatArray[0] = floatValue;

    var binaryRepresentation = new Uint32Array(floatArray.buffer);

    var binaryString = binaryRepresentation[0].toString(2).padStart(32, '0');

    return binaryString;
}

function binaryFloatToDecimal(binaryStr) {
    // Assuming 32-bit floating-point format (IEEE 754 single-precision)
    var sign = parseInt(binaryStr[0], 2);
    var exponent = parseInt(binaryStr.substr(1, 8), 2) - 127;
    var fraction = 1 + parseInt(binaryStr.substr(9), 2) / Math.pow(2, 23);

    // Applying the formula
    var value = Math.pow(-1, sign) * fraction * Math.pow(2, exponent);

    return value;
}

function baseToDecimal(baseNumber, base) {
    // Split the binary number into integer and fractional parts
    var [integerPart, fractionalPart] = baseNumber.split('.');
  
    // Convert the integer part to decimal using parseInt with a radix of 2
    var decimalInteger = parseInt(integerPart, base);
  
    // Convert the fractional part to decimal
    var decimalFraction = 0;
    if (fractionalPart) {
      for (var i = 0; i < fractionalPart.length; i++) {
        decimalFraction += parseInt(fractionalPart[i], base) / Math.pow(base, i + 1);
      }
    }
  
    // Combine the integer and fractional parts to get the final decimal number
    var decimalNumber = decimalInteger + decimalFraction;
  
    return decimalNumber;
}

function toU2(binary, numBits) {
    // Convert signed binary to U2 representation
    const value = parseInt(binary, 2);
    const maxValue = Math.pow(2, numBits);
    const u2Value = (value + maxValue) % maxValue;
    
    // Convert U2 value to binary with leading zeros
    const u2Binary = u2Value.toString(2).padStart(numBits, '0');

    return u2Binary;
}

function toU1(binaryValue, numberOfBits) {
    // Check if the number is negative
    const isNegative = binaryValue.charAt(0) === '-';

    // Remove the negative sign if present
    if (isNegative) {
        binaryValue = binaryValue.slice(1);
    }

    // Convert the binary value to an array of bits
    let bits = binaryValue.split('');
    // Ensure the result has the specified number of bits
    while (bits.length < numberOfBits) {
        bits.unshift('0');
    }

    // If the number is negative, find the one's complement
    if (isNegative) {
        bits = bits.map(bit => (bit === '0' ? '1' : '0'));
    }

    // Convert the array of bits back to a string
    return bits.join('');
}

function u2ToSigned(number, numberOfBits) {
  // Check if the number is negative
  const isNegative = number.charAt(0) === '1';

  // Pad the number with leading zeros to match the specified number of bits
  while (number.length < numberOfBits) {
    number = '0' + number;
  }

  // If the number is negative, perform two's complement
  if (isNegative) {
    let flipped = '';
    for (let i = 0; i < numberOfBits; i++) {
      flipped += number.charAt(i) === '0' ? '1' : '0';
    }

    // Add 1 to complete two's complement
    let carry = 1;
    let result = '';
    for (let i = numberOfBits - 1; i >= 0; i--) {
      const sum = parseInt(flipped.charAt(i)) + carry;
      result = (sum % 2) + result;
      carry = sum > 1 ? 1 : 0;
    }

    number = result;
  }

  return isNegative ? '-' + number : number;
}

function U1toSignedDec(u1, numBits) {
    // Check the most significant bit (MSB) to determine the sign
    const signBit = u1[0];
  
    // If MSB is 0, the number is positive
    if (signBit === '0') {
      return parseInt(u1, 2);
    }
  
    // If MSB is 1, the number is negative
    // Calculate the two's complement by flipping all bits
    let twosComplement = '';
    for (let i = 0; i < numBits; i++) {
      twosComplement += u1[i] === '0' ? '1' : '0';
    }
    // Convert the two's complement to decimal and add a negative sign
    const signedDecimal = -parseInt(twosComplement, 2);
    return signedDecimal;
}
