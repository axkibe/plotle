// Copyright (c) 2019, Ben Noordhuis <info@bnoordhuis.nl>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

'use strict';
const {EventEmitter} = require('events');
const {Session} = require('inspector');

module.exports = new class extends EventEmitter {
  await() {
    return wait.call(this);
  }

  defaults() {
    process.on('beforeExit', wait.bind(this));
  }
};

// Not written as an async/await-style function because we don't
// want our promise to show up in the list of pending promises,
// it'll deadlock when we try to await ourselves.
function wait() {
  const self = this;
  // Keep event loop alive.
  const keepalive = setInterval(() => self.emit('tick'), 1e3);
  const promises = [];
  const session = new Session();
  session.connect();
  step();

  // Get reference to Promise.prototype
  function step() {
    const params = {expression: 'Promise.prototype'};
    session.post('Runtime.evaluate', params, step1);
  }

  // Get ids (as an array) of objects that are instanceof Promise
  function step1(err, ok) {
    if (err) return done(err);
    const {objectId} = ok.result;
    const params = {prototypeObjectId: objectId};
    const callback = release(objectId, step2);
    session.post('Runtime.queryObjects', params, callback);
  }

  // Get own properties of the array
  function step2(err, ok) {
    if (err) return done(err);
    const {objectId} = ok.objects;
    const params = {objectId, ownProperties: true};
    const callback = release(objectId, step3);
    session.post('Runtime.getProperties', params, callback);
  }

  // Filter out anything that isn't an element, i.e., length and __proto__
  function step3(err, ok) {
    if (err) return done(err);
    for (const {name, value} of ok.result) {
      if (Number.isInteger(+name)) promises.push(value.objectId);
    }
    step4();
  }

  // Get internal properties of the promise
  function step4(err, ok) {
    if (err) return done(err);
    if (promises.length === 0) return done();
    const objectId = promises.shift();
    const params = {objectId, ownProperties: true};
    const callback = (err, ok) => step5(objectId, err, ok);
    session.post('Runtime.getProperties', params, callback);
  }

  // Check that the promise is pending and await it if so
  function step5(promiseObjectId, err, ok) {
    if (err) return done(err);
    const loop = release(promiseObjectId, step4);  // Go to next promise
    for (const {name, value: {value}} of ok.internalProperties) {
      if (name !== '[[PromiseStatus]]') continue;
      if (value !== 'pending') return loop();
      self.emit('await', 1 + promises.length);
      session.post('Runtime.awaitPromise', {promiseObjectId}, loop);
      return;
    }
    throw Error('unreachable');
  }

  function done(err) {
    clearInterval(keepalive);
    session.disconnect();
    if (err) self.emit('error', err);
  }

  function release(objectId, next) {
    return function(err, ok) {
      session.post('Runtime.releaseObject', {objectId}, function(err2) {
        if (err2) return done(err2);
        next(err, ok);
      });
    };
  }
}

// *** FOR TESTING ***

/*
process.once('beforeExit', () => {
  new Promise(resolve => setTimeout(() => resolve(1), 1e3));
  new Promise(resolve => setTimeout(() => resolve(2), 1e3));
  //new Promise((_, reject) => setTimeout(() => reject(Error('BOOM')), 1e3));
  //new Promise(r => {global.r = r});
});

{
  const that = module.exports;
  that.defaults();
  that.on('tick', () => console.log('tick'));
  that.on('await', (n) => console.log(`${n} pending promises`));
}
*/
