import './pug/index.pug'
import './assets/styles/style.sass'
import './js/sounds'
import './js/game'
import State from './js/state'
import LocalStorage from './js/localStorage'
window.$ls = new LocalStorage()
window.$state = new State()
