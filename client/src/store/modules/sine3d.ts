
import _ from 'lodash';
import { 
    Sine3dDataObject, 
    Sine3dDataError 
  } from '../../types/sine3d';

const WS_EVENT_DATA = 'ws/event/DATA';
const CLEAR = 'sine3d/event/CLEAR';
let default_state = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

const state: Sine3dDataObject = {
  y: default_state
};
const getters = {
  'sine3d/getter/y': state => state.y
};
const actions = {
  ['sine3d/action/clear'] ({ commit }) {
      commit(CLEAR);
  }
};
const mutations = {
  [CLEAR] (state: Sine3dDataObject) {
      state.y = default_state;
  },
  [WS_EVENT_DATA](state: Sine3dDataObject, data: any) {
      // let y: number = data.sine as number;
      // state.y = y * 100;
      if (data.type === 'WAVEFORM_SINE_3D_COMPUTED') {
        state.y = data['sine(x,y)'] as number[][];
      }
  }
};
export default {
  state, getters, actions, mutations
};
