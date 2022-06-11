import * as Nil from "./nil-launchpad.js"
import p5 from 'p5'

/**
 * Define your project traits (optional)
 * 
 * Following example shows how to setup traits for your project. Traits are composed from two parameters:
 * 1. Name - used for reference in marketplaces and explorers
 * 2. Trait function - is a function returning trait values from a random number.
 * 
 * There are at least to use-cases for traits:
 * 1. Individual traits independent from other traits
 * 2. Traits that depend on other traits
 * 
 * To add a single trait we have to define a function first:
 */

const weightFn = (n) => {
  if (n > 0.5) {
    return 1
  }
  else {
    return 2
  }
}

/**
 * This function 50% of the time will return 1, and 2 otherwise
 * To add this function to project metadata use addTrait helper function like:
 */

const weight = Nil.addTrait('strokeWeight', weightFn)

/**
 * now weight can be used as a single value for rendering
 * 
 * Sometimes it's useful to generate corelated traits, eg: matching colours
 * It's possible to do that by adding these traits together to the Nil generator.
 * In following example we will generate corelated colours for background and lines.
 * 
 * First define trait functions:
 */

const backgroundColorFn = (n) => {
  if (n <= 0.5) { // 50% chance it will be gold
    return 'gold'
  } else { // 50% chance it will be silver
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

/**
 * Adding multiple traits at once will use the same random number for all of them.
 * To get the trait values, we add the functions to the project with respective names.
 */

const [backgroundColor, lineColor] = Nil.addTraits(
  ['backgroundColor', 'lineColor'], // names how they are going to be seen in metadata
  [backgroundColorFn, lineColorFn]  // functions returning values based on a random number between 0 and 1
)

/**
 * now backgroundColor, lineColor can be used as values for rendering
 */

/**
 * Rendering metadata
 * 
 * After defining all the traits we are ready to render metadata. It is required for providing data to marketplaces.
 */
Nil.renderMetadata()

/**
 * Define your project rendering logic
 */
const margin = 25

window.windowResized = () => {
  const { width, height } = Nil.getDimensions()
  resizeCanvas(width, height)
}

window.setup = () => {
  const { width, height } = Nil.getDimensions()
  createCanvas(width, height)
  noLoop()
  strokeWeight(weight)
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
    // To use random numbers directly 
    const y = lineY + Nil.random(-range, range)
    line(prevX, prevY, x, y)

    prevX = x
    prevY = y
  }
}

new p5()
