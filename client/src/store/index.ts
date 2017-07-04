import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import example from './modules/example';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

function loadPlugins() {
  let plugins = [
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
