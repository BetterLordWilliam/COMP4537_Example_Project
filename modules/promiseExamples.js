function somePromiseExample(res) {
    return new Promise((resolve, reject) => {
        // Simulate an asynchronous operation by creating a Task, recall the promise executor funciton executes immediately
        // So we immediately queue a task that we pass into the setImmediate function as a callback
        // Microtask queue is empty at this point, so once the callstack is clear this task will complete
        // In this case we can be certain that no other microtasks will be queued by synchronous code
        setImmediate(() => {
            const success = res;
            if (success) {
                resolve({
                    message: 'Promise resolved successfully!',
                    data: [ 1, 2, 3, 4, 5 ]
                });     // Promise fulfilled, all resolved handlers will be added to the microtask queue
            } else {
                reject(new Error('Promise failed'));
                        // Promise rejected, all rejection handlers will be added to the microtask queue
            }
        });
    });
}

// Synchronous execution continues here while the task is pending...
let example = somePromiseExample(true); // resolves
example.then(
    result => {                         // then registers a fulfillment handler and a rejectio handler
        console.log(result);            // This will run
        return somePromiseExample(true); // chain another promise, this creates a new promise that resolves whent the inner promise we return resolves
                                        // This new promise will have the return value of the inner promise
    },
    error => {
        console.error(error);
    }
).then(                                 // then registers handlers on the promise returned by the previous then
    result => {
        console.log('Chained result:', result);
    },
    error => {
        console.error(error);
    }
);                                      // Handlers registered on the promises, once the promise is settle the appropriate handler will be queued in the microtask queue

let exampleFail = somePromiseExample(false); // rejects
exampleFail.then(
    result => {
        console.log(result);
    },
    error => {
        console.error(error);                // This will run
    }
);

async function asyncPromiseExample(res) {
    try {
        const result = await somePromiseExample(res);
        const result2 = await somePromiseExample(res);      // Much cleaner with async/await
                                                            // Important: understand that promises are still used implicitly, so it is important to understand them still!

        console.log(result);
        console.log('Chained result:', result2);

    } catch (error) {
        console.error(error);
    }
}

await asyncPromiseExample(true);

