const canvas = d3.select(".canvas");

const svg = canvas.append('svg')

console.log(canvas)

// append shapes to svg container
svg.append('rect');
svg.append('circle');
svg.append('line');