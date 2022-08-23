A template to setup a drop on NIL launchpad. Included example is based on P5js.

Scope:

* Help with setting up local enviorment for testing the drop
* Prepare a zip file ready to be uploaded on NIL

**Commands**

Initial dependencies installation
```
npm i
```

Starting development webserver
```
npm start
```

Note: You must use the library fully in order to ensure proper rendering during the mint. 

> import * as Nil from "./nil-launchpad.js"

**Add Traits**
```
const [backgroundColor, lineColor] = Nil.addTraits(
  ['backgroundColor', 'lineColor'], // names how they are going to be seen in metadata
  [backgroundColorFn, lineColorFn]  // functions returning values based on a random number between 0 and 1
)
```
- or -
```
const first = Nil.addTrait('first', pluck)
const second = Nil.addTrait('second', pluck)
```

**Edit NFT metadata**
* edit src/metadata.js
* Change name - This will show up as the name of each NFT with the token id after it. e.g. 'Beautiful Lines #3'
* Description
* aspect_ratio - This affects the ar of the screenshot

**Rendering Metadata for Screenshot and Minting**

**Note:** You must call this method for the launchpad to be able to save traits and take a screenshot during minting

> Nil.renderMetadata()

This will inject JSON into a special meta tag that the launchpad backend will read. The backend will not take a screenshot of the NFT until this has been done. 

A suggestion from one of our artists:

> If using p5 js, there's two places you'd call Nil.renderMetadata()
> Either at the end of setup(), if the first frame is a good screenshot.
> Or once after a certain number of frames in  draw(), if the piece needs a number of frames to get to representative state.
> Note: I imported as NIL not Nil, just use what's in your import statement import * as NIL from './nil-launchpad.js' 




Building zip file
```
npm run build
```


Installing additional dependencies:

```
npm i -D p5
```




Credits:

* Following repository is based on [fxhash boilerplate](https://github.com/fxhash/fxhash-webpack-boilerplate)
