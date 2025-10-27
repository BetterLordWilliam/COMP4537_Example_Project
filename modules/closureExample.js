function iCreateAClosure(init) {
    let count = init;
    return () => ++count;
}

const myClosure = iCreateAClosure(5);

console.log(myClosure()); // 6
console.log(myClosure()); // 7
console.log(myClosure()); // 8
console.log(myClosure()); // 9
