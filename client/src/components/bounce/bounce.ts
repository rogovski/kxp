import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';
import { connectWsRef, disconnectWsRef } from '../../runtime';

@Component({
    template: require('./bounce.html')
})
export class BounceComponent extends Vue {
    
    mounted() {
        this.$store.dispatch('bounce/action/clear');
        connectWsRef();
    }

    beforeDestroy() {
        disconnectWsRef();
    }

    get y_loc() {
        return this.$store.getters['bounce/getter/y'];
    }

    get ball_style() {
        let y: number = this.$store.getters['bounce/getter/y'] as number;
        return `top:${y}px;position:relative;height:20px;width:20px;background-color:green;`;
    }
}
