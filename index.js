// Select an item/s from the dom with pure JavaScript
const a1 = document.querySelector('div');
const a2 = document.querySelectorAll('div');
console.log(a1,a2);

// Select an item/s from the dom with D3
const b1 = d3.select('div')
const b2 = d3.selectAll('div') 
console.log(b1,b2);