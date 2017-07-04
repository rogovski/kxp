import _ from 'lodash';
import { 
    ExampleDataObject, 
    ExampleDataSuccess, 
    ExampleDataError, 
    ExampleDataState, 
    example_data_error 
  } from '../../types/example';
import { fetch_data } from '../../api/example';

const FETCH_SUCCESS = 'example/event/FETCH_SUCCESS';
const FETCHING = 'example/event/FETCHING';
const state: ExampleDataState = { 
  height: null,
  width: null,
  objects: [],
  is_fetching: false
};
const getters = {
  'example/getter/height': state => state.height,
  'example/getter/width': state => state.width,
  'example/getter/objects': state => state.objects,
  'example/getter/is_fetching': state => state.is_fetching
};
const actions = {
  ['example/action/fetch'] ({ commit }) {
    commit(FETCHING);
    fetch_data(
      exd => commit(FETCH_SUCCESS, exd), 
      err => {}
      );
  }
};
const mutations = {
  [FETCH_SUCCESS] (state: ExampleDataState, data: ExampleDataSuccess) {
    state.width = 10;
    state.height = 10;
    state.objects = data.objects;
    state.is_fetching = false;
  },
  [FETCHING] (state: ExampleDataState) {
    state.is_fetching = true;
  }
};
export default {
  state, getters, actions, mutations
};
