import * as context from "./nil-launchpad.js"
import p5 from 'p5'

/**
 * Define your project traits (optional)
 * 
 * Following example shows how to compute two correlated traits.
 * colorTrait constant defines both traits: backgroundColor and lineColor.
 * 
 * If you would like to setup traits with independent values, random number generator
 * needs to be called for each of them separately.
 */

// Define rarity of different values based on a random number
const backgroundColorFn = (n) => {
  if (n <= 0.5) { // 50%
    return 'gold'
  } else { // 50%
    return 'silver'
  }
}

const lineColorFn = (n) => {
  if (n <= 0.1) { // 10%
    return 'green'
  } else
  if (n <= 0.3) { // 20%
    return 'blue'
  } else { // 70%
    return 'white'
  }
}

// Adding multiple traits in one call will use the same random number for all of them.
// This way it's possible to have a correlated set of traits, eg. matching colours.
const [backgroundColor, lineColor] = context.addTraits(
  ['backgroundColor', 'lineColor'], // names how they are going to be seen in metadata
  [backgroundColorFn, lineColorFn]  // functions returning values based on a random number between 0 and 1
)

// Individual traits can be added as follows:
// const someTrait = context.addTrait('some trait', (n) => `value of ${n}`)

/**
 * Rendering metadata
 * 
 * This fragment is required because it is rendering metadata for marketplaces compatility.
 */
context.renderMetadata()

/**
 * Define your rendering logic
 */
const margin = 25

window.windowResized = () => {
  const { width, height } = context.getDimensions()
  resizeCanvas(width, height)
}

window.setup = () => {
  const { width, height } = context.getDimensions()
  createCanvas(width, height)
  noLoop()
  strokeWeight(2)
}

window.draw = () => {
  background(backgroundColor)
  stroke(lineColor)

  noFill()
  rect(margin, margin, width - margin * 2, height - margin * 2)

  for (let y = margin*2; y < height - margin * 2; y += 25) {
    drawLine(y)
  }
}

const drawLine = (lineY) => {
  const range = map(lineY, margin * 2, height - margin * 2, 0, 50)

  let prevX = margin * 2
  let prevY = lineY
  const lineSpacing = 10

  for (let x = prevX + lineSpacing; x <= width - margin * 2; x += lineSpacing) {
    const y = lineY + random(-range, range)
    line(prevX, prevY, x, y)

    prevX = x
    prevY = y
  }
}

new p5()
