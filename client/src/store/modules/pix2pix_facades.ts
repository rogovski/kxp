import _ from 'lodash';
import * as api from '../../api/pix2pix_facades';
import { 
  Pix2PixFacadesState,
  ArchComponent
  } from '../../types/pix2pix_facades';

// const WS_EVENT_DATA = 'ws/event/DATA';
const ARCH_COMPONENT_DRAWN = 'pix2pix_facades/events/ARCH_COMPONENT_DRAWN';
const ARCH_COMPONENT_SELECTED = 'pix2pix_facades/events/ARCH_COMPONENT_SELECTED';
const CLEAR = 'pix2pix_facades/events/CLEAR';

function map_arch_z_index(archtag: string): number {
  if (archtag === 'facade') return 2;
  if (archtag === 'molding') return 3;
  if (archtag === 'cornice') return 4;
  if (archtag === 'pillar') return 5;
  if (archtag === 'window') return 6;
  if (archtag === 'door') return 7;
  if (archtag === 'sill') return 8;
  if (archtag === 'blind') return 9;
  if (archtag === 'balcony') return 10;
  if (archtag === 'shop') return 11;
  if (archtag === 'deco') return 12;
  return 0;
}
function map_arch_color(archtag: string): string {
  if (archtag === 'facade') return 'background-color:rgb(0,0,232);';
  if (archtag === 'molding') return 'background-color:rgb(0,56,255);';
  if (archtag === 'cornice') return 'background-color:rgb(0,148,255);';
  if (archtag === 'pillar') return 'background-color:rgb(12,244,234);';
  if (archtag === 'window') return 'background-color:rgb(86,255,160);';
  if (archtag === 'door') return 'background-color:rgb(160,255,86);';
  if (archtag === 'sill') return 'background-color:rgb(234,255,12);';
  if (archtag === 'blind') return 'background-color:rgb(255,170,0);';
  if (archtag === 'balcony') return 'background-color:rgb(255,85,0);';
  if (archtag === 'shop') return 'background-color:rgb(232,0,0);';
  if (archtag === 'deco') return 'background-color:rgb(127,0,0);';
  return 'background-color:rgb(0,0,127);';
}

const state: Pix2PixFacadesState = {
  selectedArchComponent: 'facade',
  drawnComponents: []
};
const getters = {
  'pix2pix_facades/getters/selectedArchComponent': state => state.y,
  'pix2pix_facades/getters/drawnComponents': state => state.drawnComponents
};
const actions = {
  ['pix2pix_facades/actions/selectArchComponent'] ({ commit }, archComponent) {
      commit(ARCH_COMPONENT_SELECTED, archComponent);
  },
  ['pix2pix_facades/actions/clear'] ({ commit }) {
    commit(CLEAR);
  },
  ['pix2pix_facades/actions/persist_workspace'] ({ commit }, drawnComponents) {
    api.persistLabelsToWorkspace(drawnComponents).then(data => {
      console.log(data);
    });
  }
};
const mutations = {
  [ARCH_COMPONENT_SELECTED] (state: Pix2PixFacadesState, archComponent: string) {
      state.selectedArchComponent = archComponent;
  },
  [ARCH_COMPONENT_DRAWN] (state: Pix2PixFacadesState, obj: any) {
    let new_component = Object.assign(
      {}, obj, { 
        tag: state.selectedArchComponent,
        z_index: map_arch_z_index(state.selectedArchComponent),
        bgstyle: map_arch_color(state.selectedArchComponent)
      }) as ArchComponent;
    console.log(new_component);
    state.drawnComponents.push(new_component);
  },
  [CLEAR] (state: Pix2PixFacadesState) {
    state.drawnComponents = [];
  }
};
export default {
  state, getters, actions, mutations
};
