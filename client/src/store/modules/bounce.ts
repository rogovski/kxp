import _ from 'lodash';
import { 
    BounceDataObject, 
    BounceDataError 
  } from '../../types/bounce';

const WS_EVENT_DATA = 'ws/event/DATA';
const CLEAR = 'bounce/event/CLEAR';

const state: BounceDataObject = {
  y: 0
};
const getters = {
  'bounce/getter/y': state => state.y
};
const actions = {
  ['bounce/action/clear'] ({ commit }) {
      commit(CLEAR);
  }
};
const mutations = {
  [CLEAR] (state: BounceDataObject) {
      state.y = 0;
  },
  [WS_EVENT_DATA](state: BounceDataObject, data: any) {
      let y: number = data.sine as number;
      state.y = y * 100;
  }
};
export default {
  state, getters, actions, mutations
};
