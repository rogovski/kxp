import * as Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import { HomeComponent } from './components/home';
import { ExampleComponent } from './components/example';
import { BounceComponent } from './components/bounce';
import { AboutComponent } from './components/about';
import { ListComponent } from './components/list';
import { NavbarComponent } from './components/navbar';
import { Pix2pixFacadesComponent } from './components/pix2pix_facades';

// register the plugin
Vue.use(VueRouter);

let router = new VueRouter({
  routes: [
    { path: '/', component: Pix2pixFacadesComponent },
    { path: '/home2', component: HomeComponent },
    { path: '/example', component: ExampleComponent },
    { path: '/bounce', component: BounceComponent },
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
