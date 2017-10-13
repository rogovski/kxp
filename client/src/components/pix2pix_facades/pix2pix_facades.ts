import Vue from 'vue';
import * as types from 'vue/types';
import { Component, watch } from 'vue-property-decorator';
import { FacadeSelectorComponent } from './facade_selector';
import { ArchComponentComponent } from './arch_component';
import _pointer_mask from '../../directives/pointer-mask';
type DirectiveOptions = types.DirectiveOptions;
let pointer_mask = _pointer_mask as DirectiveOptions;

@Component({
  template: require('./pix2pix_facades.html'),
  directives: {
    'pointer_mask': pointer_mask
  },
  components: {
    'FacadeSelector': FacadeSelectorComponent,
    'ArchComponent': ArchComponentComponent
  }
})
export class Pix2pixFacadesComponent extends Vue {

  mounted() {
  }
  get selectedArchComponent() {
    return this.$store.getters['pix2pix_facades/getters/selectedArchComponent'];
  }
  get drawnComponents() {
    return this.$store.getters['pix2pix_facades/getters/drawnComponents'];
  }
  get box_mask_dims() {
    return 'z-index:50;height:256px;width:256px;';
  }
  get pointer_mask_binding() {
    return {
      dims: { height: 256, width: 256 },
      forward_message: 'pix2pix_facades/events/ARCH_COMPONENT_DRAWN'
    };
  }

  onClearClick() {
    this.$store.dispatch('pix2pix_facades/actions/clear');
  }

  @watch('drawnComponents')
  notifyServer() {
    this.$store.dispatch('pix2pix_facades/actions/persist_workspace', this.drawnComponents);
  }

}
