const data = [
  {width: 200, height: 100, fill: 'purple'}
]

const svg = d3.select('svg');

const rect = svg.select('rect')
  .data(data)
  .attr('width', (d, i, n) => {
    console.log(this);
    console.log(n[i]); // grab the current element
    return d.width
  })
  .attr('height', function(d){
    console.log(this) // grab the current element
    return d.height
  })
  .attr('fill', function(d){return d.fill});

  // console.log(rect)