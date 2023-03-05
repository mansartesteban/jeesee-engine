class MathUtils {
	static random(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	static mapRange(x: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
		return toMin + ((toMax - toMin) / (fromMax - fromMin)) * (x - fromMin);
	}
	static minMax(x: number, min: number, max: number): number {
		return x < min ? min : (x > max ? max : x);
	}
}

export default MathUtils;
