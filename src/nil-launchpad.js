const randomGenerator = (seed) => {
  // TODO: validate seed length
  const hashes = seed.match(/.{1,16}/g).map(r => parseInt(r, 16))
  const sfc32 = (a, b, c, d) => {
    return () => {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }
  const generator = sfc32(...hashes)

  const randomNumberInRange = (start = 0, end = 1) => (
    generator() * (Math.abs(start) + Math.abs(end)) + start
  )
  
  return randomNumberInRange
}

const randomSeed = (size = 64) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

/**
 * Constrains a box (width x height) to fit in a containing box (maxWidth x maxHeight), preserving the aspect ratio
 * 
 * @param maxWidth   width of the containing box
 * @param maxHeight  height of the containing box
 * @param ratio
 * @return           { width, height } of the resized box
 */
const fitInBox = (maxWidth, maxHeight, ratio) => {
  let viewportRatio = maxWidth / maxHeight,
    width  = 0,
    height = 0

  if (ratio == undefined || ratio == null || ratio == 0) {
    width = maxWidth
    height = maxHeight
  } else if (ratio <= viewportRatio) {
    height = maxHeight
    width = Math.floor(height * ratio)
  } else {
    width = maxWidth
    height = Math.floor(width / ratio)
  }

  return {
    width: width,
    height: height
  }
}

/**
 * @returns maximal visible dimentions for canvas rendering
 */
const getDimensions = () => {
  const maxWidth = document.body.clientWidth
  const body = document.body,
    html = document.documentElement
  const maxHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  const { ratio } = getMetadata()

  return fitInBox(maxWidth, maxHeight, ratio)
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})

const { nilSeed, nilseed, preview } = params


// Randomise seed
const seed = nilSeed || nilseed || (preview ? randomSeed() : null)

if (!seed) {
  throw ('seed not defined')
}

/**
 * Random number source for the project, always use this to guarantee deterministic results based on a seed
 */
const random = randomGenerator(seed)

const attributes = []

/**
 * Function used to generate trait values. For example you can use it to generate colours from a 0..1 random number range. Like:
 * 
 * ```
 * const colourFn = (n) => n > 0.5 ? 'blue' : 'green'
 * ```
 * 
 * @callback Trait
 * @param {number} randomNumber takes a random number from a project generator
 * @returns {*} user defined output
 */

/**
 * Defines a trait
 * 
 * @param {string} name As it will be shown in marketplaces and explorers
 * @param {Trait} traitFunction user defined trait function
 * @param {number} randomNumber it's useful only for sharing same random number for multiple traits
 * @returns return value of the trait function
 */
const addTrait = (name, traitFunction, randomNumber = random()) => {
  const value = traitFunction(randomNumber)
  attributes.push({
    trait_type: name,
    value
  })

  return value
}

/**
 * Add multiple traits at once sharing same random number to generate trait values.
 * 
 * @param {string[]} names 
 * @param {Trait[]} functions 
 * @returns array of trait values from trait functions
 */
const addTraits = (names, functions) => {
  if (names.size != functions.size) {
    throw('Provide names for all the trait functions. Both arrays should have the same length.')
  }

  const randomNumber = random()
  return names.map((name, idx) => addTrait(name, functions[idx], randomNumber))
}

const getMetadata = () => {
  if (!window.nil || !window.nil.metadata) {
    throw "Project metadata not defined"
  }

  return {
    ...window.nil.metadata,
    attributes,
  }
}

/**
 * Rendering metadata
 * 
 * Required to be called in a project, because it is rendering metadata for marketplaces compatility.
 * Without it project won't be able to show any traits
 */
const renderMetadata = () => {
  const metadata = getMetadata()
  const meta = document.createElement('meta')
  meta.name = "nil-metadata"
  meta.content = JSON.stringify(metadata)
  document.getElementsByTagName('head')[0].appendChild(meta)
}

export { random, addTraits, addTrait, renderMetadata, getDimensions }
