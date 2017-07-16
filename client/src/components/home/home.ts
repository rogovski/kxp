import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';
import { connectWsRef, disconnectWsRef } from '../../runtime';
import testdirective from '../../directives/test';

@Component({
  template: require('./home.html'),
  directives: {
    testdirective: testdirective
  }
})
export class HomeComponent extends Vue {

    package: string = 'vue-webpack-typescript';
    repo: string = 'https://github.com/ducksoupdev/vue-webpack-typescript';
    mode: string = process.env.ENV;
    

    mounted() {
        this.$store.dispatch('sine3d/action/clear');
        connectWsRef();
    }

    beforeDestroy() {
        disconnectWsRef();
    }
    get y_loc() {
        return this.$store.getters['sine3d/getter/y'];
    }
}
