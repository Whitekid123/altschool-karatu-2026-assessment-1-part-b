// Problem 4: keep count private in a closure and expose its value through a getter.
function createCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
    },
    decrement() {
      count -= 1;
    },
    get value() {
      return count;
    },
  };
}

if (require.main === module) {
  const counter = createCounter();
  counter.increment();
  counter.increment();
  counter.decrement();
  console.log(counter.value); // 1
  console.log(counter.count); // undefined
}

module.exports = createCounter;
