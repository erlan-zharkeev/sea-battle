import Sound from './sound'

export const sounds = {
  background: null,
  miss: null,
  hit: null,
  sunk: null,
}

Object.keys(sounds).forEach((name) => {
  sounds[name] = new Sound(name)
})

