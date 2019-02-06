// select svg container
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600)

// create margins and dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100}
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g');

// scales
const y = d3.scaleLinear()
  .range([graphHeight, 0])

const x = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2)

// create the axis
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + ' orders');

// x axis text
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')

const t = d3.transition().duration(1500);

// update function
const update = (data) => {

  // updating scale domains
  y.domain([0, d3.max(data, d => d.orders)])
  x.domain(data.map(item => item.name))

  // join the data to rects
  const rects = graph.selectAll('rect')
    .data(data);

  // remove exit selection
  rects.exit().remove();

  // add/update attrs to rects already in DOM
  rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name)) // using the scaleBand instead
    // .transition(t)
    //   .attr('height', d => graphHeight - y(d.orders))
    //   .attr('y', d => y(d.orders))

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name)) // using the scaleBand instead
    .attr('y', graphHeight)
    .merge(rects) // merge the current rect selection, the current element in the DOM. And apply the bellow to both the enter selection and current selection already in the DOM
    .transition(t)
      .attrTween('width', widthTween)
      .attr('y', d => y(d.orders))
      .attr('height', d => graphHeight - y(d.orders))

  // Call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

};


var data = [];

// get data from firestore
db.collection('dishes').onSnapshot(res => {

  res.docChanges().forEach(change => {

    const doc = {...change.doc.data(), id: change.doc.id}

    console.log(doc);
    console.log(change);

    switch(change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  });

  update(data)

});

// Starting conditions:
// Y = graphHeight
// Height = 0

// Ending conditions:
// Y = y(d.orders)
// height = graphHeight - y(d.orders)


// TWEENS

const widthTween = (d) => {

  // define interpolation
  // d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, x.bandwidth());

  // return a function which takes in a time ticker 't'
  return function(t) {

    // return the value from passing the ticker into the interpolation
    return i(t)
  }

}