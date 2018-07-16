# Observer pattern implementation for JavaScript

## Project page
[GitHub](https://github.com/Furmanus/Observer)

## Installation
`npm install observer-lc`

## How to use
For enabling listening on events or notifying events, object has to extend Observer class (needs to have Observer
methods in its prototype chain). Instance of `Observer` can call `listen(event, callback)` method to listen to specific
event. After event is notified by other instance of `Observer`, callback function is called with `this` value set to
instance of `Observer` which called `listen()` method. See examples below.

## API
- listen(event: `string`, callback: `function`, notifier: `Observer`) - enables listening on specific event. After
event is notified, callback function is called with `this` value set to instance of `Observer` which called listen
method. Optional parameter notifier enables listening on specific event only from specific object.

- listenOnce(event: `string`, callback: `function`, notifier: `Observer`) - works exactly as `listen` method, with
difference that after first notification, object which called `listenOnce` method no longer listens on specified event.

- stopListening(event: `string`, notifier: `Observer`) - disables listening on specified event. When optional notifier
argument was passed, object which called `listen` method will stop listening on specified event, only if `listen`
method was called with same notifier.

- notify(event: `string`, data: `any`) - Notifies all listeners that specific event happened along with additional data
passed to callback function. If no data is specified, empty object is passed by default.
##Examples
```
const Observer = require('observer-lc');
let count = 0;
class A extends Observer {
    constructor () {
        super();
    }
}

class B extends Observer {
    constructor (name) {
        super();

        this.name = name;
        const int = setInterval(function () {
            this.notify('test', name + ': ' + ++count);
        }.bind(this), 1000);
    }
}

const a = new A();
const b = new B('b');
const c = new B('c');

a.listen('test', function (data) {
    console.log(data);
});
setTimeout(function () {
    a.stopListening('test');
}.bind(this), 3000);
```
Expected output:
```
b: 1
c: 2
b: 3
c: 4

```
With specified notifier:
```
const Observer = require('observer-lc');
let count = 0;
class A extends Observer {
    constructor () {
        super();
    }
}

class B extends Observer {
    constructor (name) {
        super();

        this.name = name;
        const int = setInterval(function () {
            this.notify('test', name + ': ' + ++count);
        }.bind(this), 1000);
    }
}

const a = new A();
const b = new B('b');
const c = new B('c');

a.listen('test', function (data) {
    console.log(data);
},c);
setTimeout(function () {
    a.stopListening('test');
}.bind(this), 3000);
```
Expected output:
```
c: 2
c: 4
```
With listenOnce:
```
const Observer = require('observer-lc');
let count = 0;
class A extends Observer {
    constructor () {
        super();
    }
}

class B extends Observer {
    constructor (name) {
        super();

        this.name = name;
        const int = setInterval(function () {
            this.notify('test', name + ': ' + ++count);
        }.bind(this), 1000);
    }
}

const a = new A();
const b = new B('b');
const c = new B('c');

a.listenOnce('test', function (data) {
    console.log(data);
},c);
setTimeout(function () {
    a.stopListening('test');
}.bind(this), 3000);
```
Expected output:
```
c: 2
```
## Author
Łukasz Lach
e-mail: mietek76(at)gmail.com
