import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  template: require('./arch_component.html')
})
export class ArchComponentComponent extends Vue {

  @Prop
  data: any;

  mounted() {
  }
  get archComponentStyle() {
    let x = this.data.x;
    let y = this.data.y;
    let w = this.data.w;
    let h = this.data.h;
    let z_index = this.data.z_index;
    let postype = `position:absolute;z-index:${z_index};`;
    let dims = `height:${h}px;width:${w}px;`;
    let pos = `left:${x}px;top:${y}px;`;
    return postype + dims + pos + this.data.bgstyle;
  }

}
