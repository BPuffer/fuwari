const PRIME_NUMBERS = [
	2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
	73, 79, 83, 89, 97,
]; // 应该不会超过 97
function getShuffledPrimes(length: number) {
	const selectedPrimes = PRIME_NUMBERS.slice(0, length);
	const selectedPrimesMean = selectedPrimes.reduce((a, b) => a + b, 0) / length;
	return selectedPrimes
		.map((p) => p / selectedPrimesMean)
		.sort(() => Math.random() - 0.5);
}

let spare: number;
let hasSpare: boolean;
function normal(mean = 0, stdDev = 1): number {
	if (hasSpare) {
		hasSpare = false;
		return spare * stdDev + mean;
	}
	let u: number;
	let v: number;
	let s: number;
	do {
		u = Math.random() * 2 - 1;
		v = Math.random() * 2 - 1;
		s = u * u + v * v;
	} while (s >= 1 || s === 0);
	const mul: number = Math.sqrt((-2.0 * Math.log(s)) / s);
	spare = v * mul;
	hasSpare = true;
	return u * mul * stdDev + mean;
}

function combine(n: number, k_: number) {
	let k = k_;
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;

	k = Math.min(k, n - k);
	let result = 1;

	for (let i = 1; i <= k; i++) {
		result = (result * (n - k + i)) / i;
	}

	return Math.round(result);
}

function linspace(start: number, stop: number, num: number, endpoint = true) {
	if (num === 1) {
		// linspace 标准：num=1 时返回 [stop]（endpoint=true）或 [start]（endpoint=false）
		return [endpoint ? stop : start];
	}
	return Array.from(
		{ length: num },
		(_, i) => start + ((stop - start) / (endpoint ? num - 1 : num)) * i,
	);
}

function powerTransform(vector: number[], exponent: number) {
	return vector.map((x) => x ** exponent);
}

function choice<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

function banner2Param(
	opacityTiers: number[],
	speed: number,
	frequencyTimes: number | number[],
	vbMax: number,
	amplitude_stdpara: [number, number],
) {
	const tierLen = opacityTiers.length;

	const _durationK = getShuffledPrimes(tierLen);
	const durations = opacityTiers.map(
		(_, i) => _durationK[i] * normal(1, 0.1) * speed,
	);
	// 循环次：越多波浪越密集。整数。随机化。1导致数学问题，因为我不想修，要避免
	const bFrequencyTimes =
		frequencyTimes === 0
			? // 0 表示全不重复随机化
				linspace(2, 1 + tierLen, tierLen).sort((_, __) => Math.random() - 0.5)
			: Array.isArray(frequencyTimes)
				? // 数组表示从这些值中随机选择
					opacityTiers.map(() => choice(frequencyTimes as number[]))
				: Array(tierLen).fill(frequencyTimes);

	// 振幅：上下小中间大。可以用杨辉三角
	const amplitudes = powerTransform(
		opacityTiers.map((_, i) => {
			return (combine(tierLen - 1, i) + 1) / amplitude_stdpara[1];
		}),
		amplitude_stdpara[0],
	);

	// 高度：均匀分布。用linspace(0, vb_max, wT)
	const heights = linspace(0, 1 - vbMax / 100, tierLen, false);

	// 最大的高度+振幅
	const maxVbpa = Math.max(...heights.map((h, i) => {
		return h + amplitudes[i]
	}));

	return {
		durations,
		frequencyTimes: bFrequencyTimes,
		amplitudes,
		heights,
		maxVbpa
	};
}

export {
	normal,
	getShuffledPrimes,
	combine,
	linspace,
	powerTransform,
	choice,
	banner2Param,
};
