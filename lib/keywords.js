const keywords = {
    'AS': {
        isReserved: true,
    },
    'AND': {
        isReserved:true,
        isNewLineBefore: true,
        numIdent: 2,
    },
    'AVG': {
        isReserved: true,
        isFunction: true,
    },
    'BY': {
        isReserved: true,
    },
    'CASE': {
        isReserved: true,
        parenthesisPair: 'END',
    },
    'COUNT': {
        isReserved: true,
        isFunction: true,
    },
    'DISTINCT': {
        isReserved: true,
        isNewLineAfter: true,
    },
    'END': {
        isReserved: true,
    },
    'FROM': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'GROUP': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'HAVING': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'JOIN': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'LEFT': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'LENGTH': {
        isReserved: true,
        isFunction: true,
    },
    'MAX': {
        isReserved: true,
        isFunction: true,
    },
    'MIN': {
        isReserved: true,
        isFunction: true,
    },
    'NVL': {
        isReserved: true,
        isFunction: true,
    },
    'ON': {
        isReserved: true,
    },
    'RIGHT': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'SELECT': {
        isReserved: true,
        isNewLineAfter: true,
        parenthesisPair: 'FROM',
    },
    'SYSDATE': {
        isReserved: true,
    },
    'THEN': {
        isReserved: true,
    },
    'TRIM': {
        isReserved: true,
        isFunction: true,
    },
    'UNION': {
        isNewLineBefore: true,
        isNewLineAfter: true,
    },
    'WHEN': {
        isReserved: true,
    },
    'WHERE': {
        isReserved: true,
        isNewLineBefore: true,
    },
    'WITH': {
        isReserved: true,
    },
    '(': {
        isNewLineAfter: true,
        isSpecialChar: true,
        parenthesisPair: ')',
    },
    ')': {
        isNewLineBefore: true,
        isNewLineAfter: true,
        isSpecialChar: true,
    },
    ',': {
        isNewLineBefore: true,
        isSpecialChar: true,
    },
    '+': {
        isSpecialChar: true,
    },
    '<': {
        isSpecialChar: true,
    },
    '>': {
        isSpecialChar: true,
    },
    '=': {
        isSpecialChar: true,
    },
    '|': {
        isSpecialChar: true,
    },
    ';': {
        isSpecialChar: true,
        isNewLineBefore: true,
        isNewLineAfter: true,
    },
};

// module.exports = keywords;
