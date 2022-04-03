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

const nil = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  const { nilSeed, preview } = params

  // Randomise seed
  const seed = nilSeed || (preview ? randomSeed() : null)

  if (!seed) {
    throw ('seed not defined')
  }

  const random = randomGenerator(seed)

  const attributes = []
  
  const addTrait = (name, traitFunction, randomNumber = random()) => {
    const value = traitFunction(randomNumber)
    attributes.push({
      trait_type: name,
      value
    })

    return value
  }

  const addTraits = (names, functions) => {
    if (typeof functions === Function) {
      return addTrait(names, functions)
    }
    if (names.size != functions.size) {
      throw('Provide names for all the trait functions. Both arrays should have the same length.')
    }

    const randomNumber = random()
    return names.map((name, idx) => addTrait(name, functions[idx], randomNumber))
  }

  const renderMetadata = () => {
    if (!window.nil || !window.nil.metadata) {
      throw ('Project metadata not defined')
    }

    const metadata = {
      ...window.nil.metadata,
      attributes,
    }

    const meta = document.createElement('meta');
    meta.name = "nil-metadata";
    meta.content = JSON.stringify(metadata);
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  return { random, addTraits, renderMetadata }
}

export { nil }