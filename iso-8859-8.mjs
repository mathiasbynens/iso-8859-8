/*! https://mths.be/iso-8859-8 v3.0.4 by @mathias | MIT license */

const stringFromCharCode = String.fromCharCode;

const INDEX_BY_CODE_POINT = new Map([
	[128, 0],
	[129, 1],
	[130, 2],
	[131, 3],
	[132, 4],
	[133, 5],
	[134, 6],
	[135, 7],
	[136, 8],
	[137, 9],
	[138, 10],
	[139, 11],
	[140, 12],
	[141, 13],
	[142, 14],
	[143, 15],
	[144, 16],
	[145, 17],
	[146, 18],
	[147, 19],
	[148, 20],
	[149, 21],
	[150, 22],
	[151, 23],
	[152, 24],
	[153, 25],
	[154, 26],
	[155, 27],
	[156, 28],
	[157, 29],
	[158, 30],
	[159, 31],
	[160, 32],
	[162, 34],
	[163, 35],
	[164, 36],
	[165, 37],
	[166, 38],
	[167, 39],
	[168, 40],
	[169, 41],
	[171, 43],
	[172, 44],
	[173, 45],
	[174, 46],
	[175, 47],
	[176, 48],
	[177, 49],
	[178, 50],
	[179, 51],
	[180, 52],
	[181, 53],
	[182, 54],
	[183, 55],
	[184, 56],
	[185, 57],
	[187, 59],
	[188, 60],
	[189, 61],
	[190, 62],
	[215, 42],
	[247, 58],
	[1488, 96],
	[1489, 97],
	[1490, 98],
	[1491, 99],
	[1492, 100],
	[1493, 101],
	[1494, 102],
	[1495, 103],
	[1496, 104],
	[1497, 105],
	[1498, 106],
	[1499, 107],
	[1500, 108],
	[1501, 109],
	[1502, 110],
	[1503, 111],
	[1504, 112],
	[1505, 113],
	[1506, 114],
	[1507, 115],
	[1508, 116],
	[1509, 117],
	[1510, 118],
	[1511, 119],
	[1512, 120],
	[1513, 121],
	[1514, 122],
	[8206, 125],
	[8207, 126],
	[8215, 95]
]);
const INDEX_BY_POINTER = new Map([
	[0, '\x80'],
	[1, '\x81'],
	[2, '\x82'],
	[3, '\x83'],
	[4, '\x84'],
	[5, '\x85'],
	[6, '\x86'],
	[7, '\x87'],
	[8, '\x88'],
	[9, '\x89'],
	[10, '\x8A'],
	[11, '\x8B'],
	[12, '\x8C'],
	[13, '\x8D'],
	[14, '\x8E'],
	[15, '\x8F'],
	[16, '\x90'],
	[17, '\x91'],
	[18, '\x92'],
	[19, '\x93'],
	[20, '\x94'],
	[21, '\x95'],
	[22, '\x96'],
	[23, '\x97'],
	[24, '\x98'],
	[25, '\x99'],
	[26, '\x9A'],
	[27, '\x9B'],
	[28, '\x9C'],
	[29, '\x9D'],
	[30, '\x9E'],
	[31, '\x9F'],
	[32, '\xA0'],
	[34, '\xA2'],
	[35, '\xA3'],
	[36, '\xA4'],
	[37, '\xA5'],
	[38, '\xA6'],
	[39, '\xA7'],
	[40, '\xA8'],
	[41, '\xA9'],
	[42, '\xD7'],
	[43, '\xAB'],
	[44, '\xAC'],
	[45, '\xAD'],
	[46, '\xAE'],
	[47, '\xAF'],
	[48, '\xB0'],
	[49, '\xB1'],
	[50, '\xB2'],
	[51, '\xB3'],
	[52, '\xB4'],
	[53, '\xB5'],
	[54, '\xB6'],
	[55, '\xB7'],
	[56, '\xB8'],
	[57, '\xB9'],
	[58, '\xF7'],
	[59, '\xBB'],
	[60, '\xBC'],
	[61, '\xBD'],
	[62, '\xBE'],
	[95, '\u2017'],
	[96, '\u05D0'],
	[97, '\u05D1'],
	[98, '\u05D2'],
	[99, '\u05D3'],
	[100, '\u05D4'],
	[101, '\u05D5'],
	[102, '\u05D6'],
	[103, '\u05D7'],
	[104, '\u05D8'],
	[105, '\u05D9'],
	[106, '\u05DA'],
	[107, '\u05DB'],
	[108, '\u05DC'],
	[109, '\u05DD'],
	[110, '\u05DE'],
	[111, '\u05DF'],
	[112, '\u05E0'],
	[113, '\u05E1'],
	[114, '\u05E2'],
	[115, '\u05E3'],
	[116, '\u05E4'],
	[117, '\u05E5'],
	[118, '\u05E6'],
	[119, '\u05E7'],
	[120, '\u05E8'],
	[121, '\u05E9'],
	[122, '\u05EA'],
	[125, '\u200E'],
	[126, '\u200F']
]);

// https://encoding.spec.whatwg.org/#error-mode
const decodingError = (mode) => {
	if (mode === 'replacement') {
		return '\uFFFD';
	}
	// Else, `mode == 'fatal'`.
	throw new Error();
};

const encodingError = (mode) => {
	if (mode === 'replacement') {
		return 0xFFFD;
	}
	// Else, `mode == 'fatal'`.
	throw new Error();
};

// https://encoding.spec.whatwg.org/#single-byte-decoder
export const decode = (input, options) => {
	let mode;
	if (options && options.mode) {
		mode = options.mode.toLowerCase();
	}
	// “An error mode […] is either `replacement` (default) or `fatal` for a
	// decoder.”
	if (mode !== 'replacement' && mode !== 'fatal') {
		mode = 'replacement';
	}

	const length = input.length;

	// Support byte strings as input.
	if (typeof input === 'string') {
		const bytes = new Uint16Array(length);
		for (let index = 0; index < length; index++) {
			bytes[index] = input.charCodeAt(index);
		}
		input = bytes;
	}

	const buffer = [];
	for (let index = 0; index < length; index++) {
		const byteValue = input[index];
		// “If `byte` is an ASCII byte, return a code point whose value is
		// `byte`.”
		if (0x00 <= byteValue && byteValue <= 0x7F) {
			buffer.push(stringFromCharCode(byteValue));
			continue;
		}
		// “Let `code point` be the index code point for `byte − 0x80` in index
		// single-byte.”
		const pointer = byteValue - 0x80;
		if (INDEX_BY_POINTER.has(pointer)) {
			// “Return a code point whose value is `code point`.”
			buffer.push(INDEX_BY_POINTER.get(pointer));
		} else {
			// “If `code point` is `null`, return `error`.”
			buffer.push(decodingError(mode));
		}
	}
	const result = buffer.join('');
	return result;
};

// https://encoding.spec.whatwg.org/#single-byte-encoder
export const encode = (input, options) => {
	let mode;
	if (options && options.mode) {
		mode = options.mode.toLowerCase();
	}
	// Support `fatal` (default) and `replacement` error modes.
	if (mode !== 'fatal' && mode !== 'replacement') {
		mode = 'fatal';
	}
	const length = input.length;
	const result = new Uint16Array(length);
	for (let index = 0; index < length; index++) {
		const codePoint = input.charCodeAt(index);
		// “If `code point` is an ASCII code point, return a byte whose
		// value is `code point`.”
		if (0x00 <= codePoint && codePoint <= 0x7F) {
			result[index] = codePoint;
			continue;
		}
		// “Let `pointer` be the index pointer for `code point` in index
		// single-byte.”
		if (INDEX_BY_CODE_POINT.has(codePoint)) {
			const pointer = INDEX_BY_CODE_POINT.get(codePoint);
			// “Return a byte whose value is `pointer + 0x80`.”
			result[index] = pointer + 0x80;
		} else {
			// “If `pointer` is `null`, return `error` with `code point`.”
			result[index] = encodingError(mode);
		}
	}
	return result;
};

export const labels = [
	'csiso88598e',
	'csisolatinhebrew',
	'hebrew',
	'iso-8859-8',
	'iso-8859-8-e',
	'iso-ir-138',
	'iso8859-8',
	'iso88598',
	'iso_8859-8',
	'iso_8859-8:1988',
	'visual'
];
