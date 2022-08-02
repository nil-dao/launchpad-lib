/**
 * 
 * Author: This will be in the tokenURI data, but does not have a purpose in the NFT Spec
 * Name: Upon render the token name will be this value + #TOKEN_ID - For example: Seed Phrase #675
 * Aspect Ratio: This value is used by the launchpad UI and the launchpad backend to render the NFT at the appropriate aspect ratio. 
 */

if (window.nil === undefined) {
  window.nil = {}
}

window.nil.metadata = {
  name: 'lines',
  author: 'anon',
  aspect_ratio: '4:3',
}
