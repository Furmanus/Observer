const Observer = require('./../scripts/observer');

class TestA extends Observer {}
class TestB extends Observer {}
class TestC extends Observer {}

describe('test observer library', () => {
    const objectA = new TestA();
    const objectB = new TestB();
    const objectC = new TestC();

    beforeEach(() => {
        objectA.stopListening();
        objectB.stopListening();
        objectC.stopListening();
    });

    test('to listener without notifier returns notify data', () => {
        let returnedValue;

        objectA.listen('test', function (data) {
            returnedValue = data;
        });
        objectB.notify('test', 2);

        expect(returnedValue).toEqual(2);
    });
    test('listener without notifier shouldn\'t be equal to wrong data', () => {
        let returnedValue;

        objectA.listen('test', function (data) {
            returnedValue = data;
        });
        objectB.notify('test', 4);

        expect(returnedValue).not.toEqual(2);
    });
    test('should throw error with invalid event type', () => {
        expect(() => {
            objectA.listen(12, () => {})
        }).toThrow(TypeError);
    });
    test('should throw error for invalid notifier type', () => {
        expect(() => {
            objectA.list('test', () => {}, {});
        }).toThrow(TypeError);
    });
    test('should listen only to specified listener', () => {
        let returnedValue;

        objectA.listen('test', function (data) {
            returnedValue = data;
        }, objectB);
        objectB.notify('test', 2);
        objectC.notify('test', 4);

        expect(returnedValue).toEqual(2);
    });
    test('async should stop listening on specific event', done => {
        let returnedValue;
        let timeoutA;
        let testTimeout;
        let intervalB;
        let intervalC;

        objectA.listen('test', function (data) {
            returnedValue = data;
        }, objectB);
        objectA.listen('test', function (data) {
            returnedValue = data;
        }, objectC);

        intervalB = setInterval(() => {
            objectB.notify('test', 'b');
        }, 100);
        intervalC = setInterval(() => {
            objectC.notify('test', 'c');
        }, 100);
        timeoutA = setTimeout(() => {
            objectA.stopListening('test', objectC);
        }, 300);
        testTimeout = setTimeout(callback, 500);

        function callback () {
            clearInterval(intervalB);
            clearInterval(intervalC);
            clearTimeout(timeoutA);
            clearTimeout(testTimeout);
            expect(returnedValue).toMatch('b');
            done();
        }
    });
});