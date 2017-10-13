import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  template: require('./facade_selector.html')
})
export class FacadeSelectorComponent extends Vue {

  @Prop
  selectedArchComponent: string;

  mounted() {
  }


  onSelectionChanged(e) {
    this.$store.dispatch('pix2pix_facades/actions/selectArchComponent', e.target.value);
  }
}
