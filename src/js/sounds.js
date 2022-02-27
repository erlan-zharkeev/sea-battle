import Sound from './sound'

let sounds = {
  background: null,
  miss: null,
  hit: null,
  sunk: null,
}

Object.keys(sounds).forEach((name) => {
  sounds[name] = new Sound(name)
})

export default sounds
