'use strict';
import 'raw-loader!./pug/index.pug';
import 'raw-loader!./pug/includes/header.pug';
import 'raw-loader!./pug/includes/footer.pug';
import style from './assets/sass/style.sass';

import './js/gamePlay.js';
import './js/positionGenerator.js';
import './js/gameControls.js';
import './js/sound.js';


//imageImporter//
function importAllImages(r) {
	let images = {};
	r.keys().map((item, index) => {
		images[item.replace('./', '')] = r(item);
	});
	return images;
}

const images = importAllImages(require.context('./assets/img', false, /\.(png|jpe?g|svg)$/));
if (module.hot) module.hot.accept();
//endOfImageImporter//