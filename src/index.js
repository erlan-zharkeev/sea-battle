/* eslint-disable import/first */
if (process.env.NODE_ENV === 'production') console.log = function () {}
import './pug/index.pug'
import './assets/sass/style.sass'
import './js/gamePlay'
import './js/positionGenerator'
import './js/gameControls'
import './js/sound'
