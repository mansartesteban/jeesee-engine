import MathUtils from "@utils/MathUtils";

/*
Todo : 
  G�rer la dispersion :
    - Recevoir une variable entre 0 et 1 (0 = aucune dispersion = ligne droite, 1 = totalement disperser = chaotique)
    - Et chaque valeur suivante devra �tre un facteur en -dispersion et +dispersion de la valeur pr�c�dente
  G�rer la pr�cision
    - Cr�er un valeur interm�diaire entre 2 valeurs qui est �loign�e de +/- dispersion
  G�rer la fr�quence ?
  G�rer l'amplitude ? (dispersion ?)
  G�rer la roughness
  G�rer la 2D et 3D ?
  G�rer la g�n�ration avec seed
*/

class MyNoise {
  // static arr = [ 0.338, 0.341, 0.34, 0.333, 0.337, 0.347, 0.3539999999999999, 0.36199999999999993, 0.35899999999999993, 0.35899999999999993, 0.36299999999999993, 0.35699999999999993, 0.35699999999999993, 0.36499999999999994, 0.36299999999999993, 0.35999999999999993, 0.3539999999999999, 0.3559999999999999, 0.3509999999999999, 0.34399999999999986, 0.3399999999999998, 0.3319999999999998, 0.3339999999999998, 0.3279999999999998, 0.3189999999999998, 0.3269999999999998, 0.3209999999999998, 0.3219999999999998, 0.3289999999999998, 0.3369999999999998, 0.3319999999999998, 0.3319999999999998, 0.33899999999999975, 0.3399999999999997, 0.33599999999999963, 0.3429999999999996, 0.33299999999999963, 0.33099999999999963, 0.3229999999999996, 0.33099999999999963, 0.3339999999999996, 0.3359999999999995, 0.3259999999999995, 0.3219999999999995, 0.3179999999999995, 0.3279999999999995, 0.3279999999999995, 0.3279999999999995, 0.33299999999999946, 0.32599999999999946, 0.31599999999999945, 0.31099999999999944, 0.30599999999999944, 0.31599999999999945, 0.30599999999999944, 0.29899999999999943, 0.30099999999999943, 0.29499999999999943, 0.30399999999999944, 0.29399999999999943, 0.2839999999999994, 0.2799999999999994, 0.2889999999999994, 0.2929999999999994, 0.2839999999999994, 0.2889999999999994, 0.29799999999999943, 0.30799999999999944, 0.30099999999999943, 0.30499999999999944, 0.30499999999999944, 0.29999999999999943, 0.2919999999999994, 0.2919999999999994, 0.30199999999999944, 0.29999999999999943, 0.30399999999999944, 0.30699999999999944, 0.30599999999999944, 0.31199999999999944, 0.31899999999999945, 0.31899999999999945, 0.3289999999999994, 0.32999999999999935, 0.31999999999999934, 0.31399999999999934, 0.3049999999999993, 0.2949999999999993, 0.2849999999999993, 0.2839999999999993, 0.2899999999999993, 0.2979999999999993, 0.3049999999999993, 0.31499999999999934, 0.32099999999999934, 0.31699999999999934, 0.31899999999999934, 0.31899999999999934, 0.32399999999999934, 0.32399999999999934];
  static arr: number[] = [];
  static dispersion = 0.1;

  static random() {
    this.arr = []
    for (let i = 0; i < 100; i++) {
      this.arr.push(Math.random())
    }
  }
  static regenerate(amount: number = 100) {
    let precision = 1000;
    this.arr = [];
    for (let i = 0; i < amount; i++) {
      let min = 0;
      let max = precision;
      if (i > 0) {
        min = (this.arr[i - 1] - this.dispersion) * precision;
        max = (this.arr[i - 1] + this.dispersion) * precision;
      }
      if (min < 0) min = 0;
      if (max > precision) max = precision;
      this.arr.push(MathUtils.random(min, max) / precision);
    }
    console.log(this.arr);
  }
  static cubicHermite(
    a: number,
    b: number,
    c: number,
    d: number,
    t: number
  ): number {
    let aPolynomial = -a / 2 + (3 * b) / 2 - (3 * c) / 2.0 + d / 2;
    let bPolynomial = a - (5 * b) / 2 + 2 * c - d / 2;
    let cPolynomial = -a / 2 + c / 2;

    return aPolynomial * t * t * t + bPolynomial * t * t + cPolynomial * t + b;
  }

  static noise(n: number, smoothness?: number): number {
    n = n % 1;

    let indexFound = this.mapRange(n, 0, 1, 0, this.arr.length);
    let nearestIndex = Math.floor(indexFound);

    let current = this.arr[nearestIndex];
    let prev = this.arr[nearestIndex - 1];
    let next = this.arr[nearestIndex + 1];
    let nextNext = this.arr[nearestIndex + 2];

    if (!prev && prev != 0) prev = current + current - next; // Si elles n'existent pas, cr�er des valeurs fant�mes en miroir bas�es sur les pr�c�dentes et suivantes
    if (!next && next != 0) next = current + current - prev; // Si elles n'existent pas, cr�er des valeurs fant�mes en miroir bas�es sur les pr�c�dentes et suivantes
    if (!nextNext && nextNext != 0) nextNext = next + next - current; // Si elles n'existent pas, cr�er des valeurs fant�mes en miroir bas�es sur les pr�c�dentes et suivantes

    let ret = this.cubicHermite(prev, current, next, nextNext, indexFound % 1);
    return ret;
  }

  static lerp(t: number, p0: number, p1: number) {
    return (1 - t) * p0 + t * p1;
  }

  static mapRange(
    x: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ) {
    return toMin + ((toMax - toMin) / (fromMax - fromMin)) * (x - fromMin);
  }
}

export default MyNoise;
