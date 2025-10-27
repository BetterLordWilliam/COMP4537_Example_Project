export default class Math {
  static PI  = 3.14;
  static E   = 2.72;

  static areaOfCircle(r) {
    return Math.PI * r * r;
  }

  static circumference(r) {
    return 2 * Math.PI * r;
  }

  static areaOfRec(l, w) {
    return l * w;
  }

  static areaOfSquare(s) {
    return areaOfRec(s, s);
  }

  instanceMethod() {
    console.log('This is an instance of the math class!');
  }
}

export function addition(a, b) {
    return a + b;
}

export async function asyncAddition(a, b) {
    return Promise.resolve(a + b);  // Totally realistic async function
}
