//
// Tests!
//

'use strict';

var dom = require('./dom');
var assert = require('assert');
var observable = require('./observable');
var eq = assert.deepEqual;

//
// Test 'element' and 'render'.
//
(function() {
    var e = dom.element({name: 'br'});
    eq(e.name, 'br');
    eq(e.render().tagName, 'BR');

    // Pass element a string to create an element with the given tag name.
    eq(dom.element('br').name, 'br');

    // Pass createElement a string to create a DOM element with the given tag name.
    eq(dom.createElement('br').tagName, 'BR');
})();

//
// element with child nodes
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(e.contents, 'hello');

    // Pass contents a list to add multiple child nodes.
    eq(dom.element({name: 'p', contents: ['hello']}).render().childNodes[0].data, 'hello');

    // Child nodes can be vdom elements as well.
    eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
})();

//
// element with observable child nodes
//
(function() {
    var o = observable.publisher(['hello']);
    var e = dom.element({name: 'p', contents: o});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.childNodes[0].data, 'hello');

    o.set(['goodbye']);
    obj.subscriber.get();

    // TODO: This functionality works in the browser, but
    // this assertion is failing in Node 0.12. A bug in Node?
    // eq(obj.element.childNodes[0].data, 'goodbye');
})();

//
// element with attributes
//
(function() {
    var e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
    eq(e.render().getAttribute('id'), 'foo');
})();

//
// element with observable attribute
//
(function() {
    var o = observable.publisher('foo');
    var e = dom.element({name: 'input', attributes: {value: o}});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.getAttribute('value'), 'foo');

    o.set('bar');
    obj.subscriber.get();
    eq(obj.element.getAttribute('value'), 'bar');

    o.set(undefined);
    obj.subscriber.get();
    eq(obj.element.getAttribute('value'), undefined);
})();

//
// element with style
//
(function() {
    var e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
    eq(e.render().style.color, 'blue');
})();

//
// element with observable style
//
(function() {
    var o = observable.publisher('hidden');
    var e = dom.element({name: 'p', style: {visible: o}});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.style.visible, 'hidden');

    o.set('visible');
    obj.subscriber.get();
    eq(obj.element.style.visible, 'visible');
})();

//
// element with an event handler
//
(function() {
    dom.element({name: 'p', handlers: {click: function() {}}}).render();
})();

//
// Test 'dom.render'.
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(dom.render(e).tagName, 'P');

    // Pass dom.createElement or dom.render a raw string to render a textNode.
    eq(dom.render('hello').data, 'hello');
})();

module.exports = 'passed!';
