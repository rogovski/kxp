import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';

@Component({
    template: require('./example.html')
})
export class ExampleComponent extends Vue {
    
    mounted () {
      this.$store.dispatch('example/action/fetch');
    }

    get doc_objects() {
        return this.$store.getters['example/getter/objects'];
    }

    get is_fetching() {
        return this.$store.getters['example/getter/is_fetching'];
    }

    on_refetch_click(e) {
        this.$store.dispatch('example/action/fetch');
    }
}
