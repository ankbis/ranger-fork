function parseJSON(jsonString) {
  let index = 0;
  const len = jsonString.length;

  function parseValue() {
    skipWhitespace();
    const char = jsonString[index];

    if (char === '{') {
      return parseObject();
    } else if (char === '[') {
      return parseArray();
    } else if (char === '"') {
      return parseString();
    } else if (/\d/.test(char)) {
      return parseNumber();
    } else if (char === 't') {
      return parseTrue();
    } else if (char === 'f') {
      return parseFalse();
    } else if (char === 'n') {
      return parseNull();
    } else {
      throw new Error(`Unexpected character at index ${index}: ${char}`);
    }
  }

  function parseObject() {
    let obj = {};
    index++;
    skipWhitespace();
    if (jsonString[index] === '}') {
      index++;
      return obj;
    }

    while (true) {
      const key = parseString();
      skipWhitespace();
      if (jsonString[index] !== ':') {
        throw new Error(`Expected ':' at index ${index}`);
      }
      index++;
      skipWhitespace();
      obj[key] = parseValue();
      skipWhitespace();
      if (jsonString[index] === '}') {
        index++;
        return obj;
      } else if (jsonString[index] !== ',') {
        throw new Error(`Expected ',' or '}' at index ${index}`);
      }
      index++;
      skipWhitespace();
    }
  }

  function parseArray() {
    let arr = [];
    index++;
    skipWhitespace();
    if (jsonString[index] === ']') {
      index++;
      return arr;
    }

    while (true) {
      arr.push(parseValue());
      skipWhitespace();
      if (jsonString[index] === ']') {
        index++;
        return arr;
      } else if (jsonString[index] !== ',') {
        throw new Error(`Expected ',' or ']' at index ${index}`);
      }
      index++;
      skipWhitespace();
    }
  }

  function parseString() {
    let str = '';
    index++;
    while (jsonString[index] !== '"') {
      if (jsonString[index] === '\\') {
        index++;
        str += jsonString[index];
      } else {
        str += jsonString[index];
      }
      index++;
    }
    index++;
    return str;
  }

  function parseNumber() {
    let num = '';
    while (/\d/.test(jsonString[index])) {
      num += jsonString[index];
      index++;
    }
    return parseFloat(num);
  }

  function parseTrue() {
    index += 4;
    return true;
  }

  function parseFalse() {
    index += 5;
    return false;
  }

  function parseNull() {
    index += 4;
    return null;
  }

  function skipWhitespace() {
    while (/\s/.test(jsonString[index])) {
      index++;
    }
  }

  return parseValue();
}

export default parseJSON;
