"use strict";
/**
 * @fileoverview Introduction to TypeScript. This example demonstrates basic
 * TypeScript features such as types, interfaces, and functions.
 */
var Index;
(function (Index) {
  function hello(name) {
    console.log(`Hello, ${name}!`);
  }
  Index.hello = hello;
})(Index || (Index = {}));
Index.hello("World");
