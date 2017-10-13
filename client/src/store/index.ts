import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import { getBusRef, getWsRef } from '../runtime';
import example from './modules/example';
import bounce from './modules/bounce';
import sine3d from './modules/sine3d';
import pix2pix_facades from './modules/pix2pix_facades';
import cliws from './plugins/global_ws';
import clibus from './plugins/global-cli-bus';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const wsRef = getWsRef();
const wsPlugin = cliws(wsRef);

const busRef = getBusRef();
const busPlugin = clibus(busRef);

function loadPlugins() {
  let plugins = [
    wsPlugin,
    busPlugin
  ];

  if (debug) {
    plugins.push(createLogger({}));
  }

  return plugins;
}

export default new Vuex.Store({
  modules: {
    example,
    bounce,
    sine3d,
    pix2pix_facades
  },
  strict: debug,
  plugins: loadPlugins()
});
