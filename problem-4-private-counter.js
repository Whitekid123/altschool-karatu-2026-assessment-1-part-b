// Problem 4: keep the count private inside the function.
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

const counter = createCounter();
counter.increment();
counter.increment();
counter.decrement();

console.log(counter.value); // 1
console.log(counter.count); // undefined
