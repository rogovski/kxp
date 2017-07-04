import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import { getWsRef } from '../runtime';
import example from './modules/example';
import cliws from './plugins/global_ws';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const wsRef = getWsRef();
const wsPlugin = cliws(wsRef);

function loadPlugins() {
  let plugins = [
    wsPlugin
  ];

  if (debug) {
    plugins.push(createLogger({}));
  }

  return plugins;
}

export default new Vuex.Store({
  modules: {
    example
  },
  strict: debug,
  plugins: loadPlugins()
});
