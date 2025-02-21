// Define the proxy marker symbol for identification
const proxyMarker = Symbol("isProxy");

type Proxied<T> = T & { [proxyMarker]?: boolean };

// Proxy handler with a cache for nested proxies
function createProxy<T extends object>(obj: T): Proxied<T> {
  const cache = new WeakMap<object, object>(); // Cache for previously proxied objects

  function handler(target: T | any, prop: PropertyKey, receiver: any): any {
    if (prop === proxyMarker) {
      return true;
    }

    // Log on read (only if it's not a proxy marker)
    if (typeof prop !== 'symbol') {
      // console.log(`Property '${String(prop)}' was read`);
    }

    const value = target[prop];
    
    // Proxy nested objects only if they're not proxied
    if (typeof value === "object" && value !== null) {
      if (!cache.has(value)) {
        cache.set(value, createProxy(value)); // Proxy nested object
      }
      return cache.get(value);
    }

    return value;
  }

  return new Proxy(obj, { get: handler }) as Proxied<T>;
}

// Example type for our nested object.
type NestedObject = {
  name: string;
  address: {
    city: string;
    zip: string;
  };
};

// Create a large nested object for testing
const nestedObject: NestedObject = {
  name: "Alice",
  address: { city: "Wonderland", zip: "12345" },
};

// Wrap the object with our proxy
const proxiedObject = createProxy(nestedObject);

// Benchmark function for direct access
function benchmarkDirectAccess(iterations: number) {
  // const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    // Directly access a deeply nested property
    let _ = nestedObject.address.city;
  }
  //const end = performance.now();
//return end - start;
}

// Benchmark function for proxy access
function benchmarkProxyAccess(iterations: number) {
  //const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    // Access the same property via the proxy
    let _ = proxiedObject.address.city;

  }
  //const end = performance.now();
  //return end - start;
  return;
}

// Run both benchmarks concurrently
/*async function runBenchmarks() {
  const iterations = 1000000;
  console.log("Running benchmarks in parallel...");

  // Run both benchmarks in parallel and wait for results
  const [directTime, proxyTime] = await Promise.all([
    benchmarkDirectAccess(iterations),
    benchmarkProxyAccess(iterations)
  ]);
  
  // Log each individual time
  console.log(`Direct access took: ${directTime.toFixed(3)} ms for ${iterations} iterations.`);
  console.log(`Proxy access took: ${proxyTime.toFixed(3)} ms for ${iterations} iterations.`);
  
  // Calculate and log the difference in time
  console.log(`Difference: ${(proxyTime - directTime).toFixed(3)} ms`);
  
  // Log the total time for both
  const totalTime = directTime + proxyTime;
  console.log(`Total time (direct + proxy): ${totalTime.toFixed(3)} ms`);
  
  // Calculate average time per access
  const directAvg = (directTime / iterations).toFixed(6);
  const proxyAvg = (proxyTime / iterations).toFixed(6);
  console.log(`Average time per direct access: ${directAvg} ms`);
  console.log(`Average time per proxy access: ${proxyAvg} ms`);
}*/

// Start the benchmarks
//runBenchmarks();
Deno.bench("DirectAccess", () =>  {benchmarkDirectAccess(1)})
Deno.bench("ProxyAccess", () =>  {benchmarkDirectAccess(1)})
