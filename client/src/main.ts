import * as Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import { HomeComponent } from './components/home';
import { ExampleComponent } from './components/example';
import { AboutComponent } from './components/about';
import { ListComponent } from './components/list';
import { NavbarComponent } from './components/navbar';

// register the plugin
Vue.use(VueRouter);

let router = new VueRouter({
  routes: [
    { path: '/', component: HomeComponent },
    { path: '/example', component: ExampleComponent },
    { path: '/about', component: AboutComponent },
    { path: '/list', component: ListComponent },
  ]
});

new Vue({
  el: '#app-main',
  router: router,
  store: store,
  components: {
    'navbar': NavbarComponent
  }
});
