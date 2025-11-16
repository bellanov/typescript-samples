"use strict";
/**
 * @fileoverview Introduction to TypeScript. This example demonstrates basic
 * TypeScript features such as types, interfaces, and functions.
 */
var SimpleTypes;
(function (SimpleTypes) {
    // Initial variable using `const`
    SimpleTypes.myString = "Hello, TypeScript!";
    // Initial variable using `let`
    SimpleTypes.myNumber = 43;
    // An array of numbers - Method 1
    // Angle brackets - familiar to C# and Java developers
    SimpleTypes.list1 = [1, 2, 3, 4, 5];
    // An array of numbers - Method 2
    // Square brackets - more common in TypeScript and familiar to developers.
    SimpleTypes.list2 = [6, 7, 8, 9, 10];
})(SimpleTypes || (SimpleTypes = {}));
// Displaying the variables
console.log("Number: " + SimpleTypes.myNumber);
console.log("String: " + SimpleTypes.myString);
// Push a number to a list
// Appends new elements to the end of an array, and returns the new length 
// of the array.
SimpleTypes.list1.push(6);
// Pop a number from a list
// Removes the last element from an array and returns that element.
SimpleTypes.list1.pop();
// Unshift a number to the beginning of a list
// Adds new elements to the beginning of an array and returns the new length
// of the array.
SimpleTypes.list1.unshift(0);
// Shift a number from the beginning of a list
// Removes the first element from an array and returns that element.
SimpleTypes.list1.shift();
document.getElementById("array-list-1").textContent = SimpleTypes.list1.toString();
document.getElementById("array-list-2").textContent = SimpleTypes.list2.toString();
// Example of using TypeScript in the browser
document.getElementById("number").textContent = SimpleTypes.myNumber.toString();
document.getElementById("string").textContent = SimpleTypes.myString;
