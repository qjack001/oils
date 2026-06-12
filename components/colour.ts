type Latent= [number, number, number, number, number, number, number]

export const COLOUR: Record<string, Latent> = {
	Red:     [0.0000, 0.2431, 0.7490, 0.0078,  0.1269, -0.1331, -0.0511],
	// to avoid conflict with "Ochre"
	// Orange:  [0.0118, 0.7848, 0.2020, 0.0015,  0.0376, -0.0186, -0.1526],
	Yellow:  [0.0039, 0.9552, 0.0141, 0.0268,  0.0462,  0.0029, -0.0577],
	Green:   [0.3294, 0.5607, 0.0000, 0.1099, -0.2821,  0.3797, -0.2186],
	Teal:    [0.4392, 0.0878, 0.0000, 0.4730, -0.2981,  0.3592,  0.0492],
	Cyan:    [0.5333, 0.0078, 0.0000, 0.4588, -0.1901,  0.1437,  0.0630],
	Blue:    [0.6902, 0.0000, 0.0588, 0.2510, -0.1098, -0.2642,  0.2522],
	Purple:  [0.3525, 0.0000, 0.2316, 0.4159,  0.1132, -0.2932,  0.3076],
	Magenta: [0.0039, 0.0000, 0.7107, 0.2854,  0.1227, -0.2277,  0.0897],
	Kblack:  [0.4863, 0.2627, 0.2471, 0.0039, -0.2220, -0.2213, -0.2202],
	White:   [0.0000, 0.0000, 0.0000, 1.0000,  0.0048,  0.0002,  0.0030],
	// Zorn mode:
	Ink:       [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	Ochre:     [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	Vermilion: [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
}

export const COLOURS = Object.entries(COLOUR)

/**
 * Mix all of the colours included in the input string; returns mixbox latent colour array
 */
export function mix(input: string): Latent {
	const weights = getWeights(input)
		.filter(Boolean) // ignore any letters that didn't map
	
	return weights.reduce((mixed, colour) => colour.map((w, i) => mixed[i] + w), new Array(7).fill(0))
		.map((w) => w / (weights.length || 1)) as Latent
}

export function getWeights(input: string): (Latent | undefined)[] {
	return [...input.toUpperCase()]
		.map(char => COLOURS.find(([name]) => name.startsWith(char))?.[1])
}
 
/**
 * Reduce the input string down to the minimum characters to preserve the ratio
 */
export function reduce(input: string) {

	const allowed = new Set(Object.keys(COLOUR).map((name) => name.charAt(0)))
	const counts = new Map<string, number>()

	for (const char of input.toUpperCase()) {
		if (allowed.has(char)) {
			const count = counts.get(char) ?? 0
			counts.set(char, count + 1)
		}
	}

	if (counts.size == 0) {
		return ''
	}

	const divisor = [...counts.values()].reduce(gcd)
	return [...counts.entries()]
		.map(([char, n]) => char.repeat(n / divisor))
		.join('')
}

// greatest common divisor
function gcd(a: number, b: number) {
	return (b == 0)
		? a
		: gcd(b, a % b)
}

/**
 * Confirms whether the given input string only includes Zorn-apporved colours
 */
export function isZorn(input: string) {
	return input && /^[VORYWKI]*$/.test(input)
}

// ==========================================================
//  MIXBOX 2.0 (c) 2022 Secret Weapons. All rights reserved.
//  License: Creative Commons Attribution-NonCommercial 4.0
//  Authors: Sarka Sochorova and Ondrej Jamriska
// 
// Modified by Jack Guinane for portability
// ==========================================================
export function toHex(latent: Latent) {

	let w = 0.0
	let r = 0.0
	let g = 0.0
	let b = 0.0

	const c0 = latent[0]
	const c1 = latent[1]
	const c2 = latent[2]
	const c3 = latent[3]
	const c00 = c0 * c0
	const c11 = c1 * c1
	const c22 = c2 * c2
	const c33 = c3 * c3
	const c01 = c0 * c1
	const c02 = c0 * c2
	const c12 = c1 * c2
	
	w = c0*c00; r += +0.07717053*w; g += +0.02826978*w; b += +0.24832992*w;
	w = c1*c11; r += +0.95912302*w; g += +0.80256528*w; b += +0.03561839*w;
	w = c2*c22; r += +0.74683774*w; g += +0.04868586*w; b += +0.00000000*w;
	w = c3*c33; r += +0.99518138*w; g += +0.99978149*w; b += +0.99704802*w;
	w = c00*c1; r += +0.04819146*w; g += +0.83363781*w; b += +0.32515377*w;
	w = c01*c1; r += -0.68146950*w; g += +1.46107803*w; b += +1.06980936*w;
	w = c00*c2; r += +0.27058419*w; g += -0.15324870*w; b += +1.98735057*w;
	w = c02*c2; r += +0.80478189*w; g += +0.67093710*w; b += +0.18424500*w;
	w = c00*c3; r += -0.35031003*w; g += +1.37855826*w; b += +3.68865000*w;
	w = c0*c33; r += +1.05128046*w; g += +1.97815239*w; b += +2.82989073*w;
	w = c11*c2; r += +3.21607125*w; g += +0.81270228*w; b += +1.03384539*w;
	w = c1*c22; r += +2.78893374*w; g += +0.41565549*w; b += -0.04487295*w;
	w = c11*c3; r += +3.02162577*w; g += +2.55374103*w; b += +0.32766114*w;
	w = c1*c33; r += +2.95124691*w; g += +2.81201112*w; b += +1.17578442*w;
	w = c22*c3; r += +2.82677043*w; g += +0.79933038*w; b += +1.81715262*w;
	w = c2*c33; r += +2.99691099*w; g += +1.22593053*w; b += +1.80653661*w;
	w = c01*c2; r += +1.87394106*w; g += +2.05027182*w; b += -0.29835996*w;
	w = c01*c3; r += +2.56609566*w; g += +7.03428198*w; b += +0.62575374*w;
	w = c02*c3; r += +4.08329484*w; g += -1.40408358*w; b += +2.14995522*w;
	w = c12*c3; r += +6.00078678*w; g += +2.55552042*w; b += +1.90739502*w;

	const clamp = (x: number) => Math.min(Math.max(x, 0.0), 1.0)
	const hex = (x: number) => x.toString(16).padStart(2, '0')

	return '#'
		+ hex((clamp(r + latent[4]) * 255.0 + 0.5) | 0)
		+ hex((clamp(g + latent[5]) * 255.0 + 0.5) | 0)
		+ hex((clamp(b + latent[6]) * 255.0 + 0.5) | 0)
}
