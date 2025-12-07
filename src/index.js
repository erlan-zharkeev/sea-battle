import './pug/index.pug'

import './assets/styles/style.scss'
import './js/sounds'
import './js/game'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .catch((error) => console.error('SW registration failed', error))
  })
}
