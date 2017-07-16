
import _ from 'lodash';

let _$ = (<any>window).$;
let THREE = (<any>window).THREE;
let Stats = (<any>window).Stats;

class ThreeAppContainer {

  SEPARATION: number;
  AMOUNTX: number;
  AMOUNTY: number;

  container: any;
  stats: any;
  camera: any;
  scene: any;
  renderer: any;
  particles: any;
  particle: any;
  count: number;
  mouseX: number;
  mouseY: number;
  windowHalfX: number;
  windowHalfY: number;
  default_state: number[][];
  current_state: number[][];

  constructor() {
    this.count = 0;
    this.mouseX = 100;
    this.mouseY = 500;
    this.AMOUNTX = 10;
    this.AMOUNTY = 10;
    this.SEPARATION = 10;
    this.particles = [];
    this.particle = null;
    this.default_state = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  init(el, binding) {
    this.camera = new THREE.PerspectiveCamera( 75, 
              (<any>window).innerWidth / (<any>window).innerHeight, 1, 10000 );
      this.camera.position.z = 1000;
      this.scene = new THREE.Scene();
      this.particles = new Array();
      let PI2 = Math.PI * 2;
      let material = new THREE.SpriteCanvasMaterial( {
          color: 0xffffff,
          program: function ( context ) {
              context.beginPath();
              context.arc( 0, 0, 0.5, 0, PI2, true );
              context.fill();
          }
      } );
      let i = 0;
      for ( let ix = 0; ix < this.AMOUNTX; ix ++ ) {

          for ( let iy = 0; iy < this.AMOUNTY; iy ++ ) {
              this.particle = this.particles[ i ++ ] = new THREE.Sprite( material );
              this.particle.position.x = ix * this.SEPARATION - 
                  ( ( this.AMOUNTX * this.SEPARATION ) / 2 );
              this.particle.position.z = iy * this.SEPARATION - 
                  ( ( this.AMOUNTY * this.SEPARATION ) / 2 );
              this.scene.add( this.particle );
          }
      }
      this.renderer = new THREE.CanvasRenderer();
      this.renderer.setPixelRatio( (<any>window).devicePixelRatio );
      this.renderer.setSize( (<any>window).innerWidth, (<any>window).innerHeight );

      this.current_state = this.default_state;

      el.appendChild( this.renderer.domElement );
      this.stats = new Stats();
      el.appendChild( this.stats.dom );
      // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
      // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
      // window.addEventListener( 'resize', onWindowResize, false );
  }
  render () {
      this.camera.position.x += ( this.mouseX - this.camera.position.x ) * .05;
      this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * .05;
      this.camera.lookAt( this.scene.position );
      let i = 0;
      for ( let ix = 0; ix < this.AMOUNTX; ix ++ ) {
          for ( let iy = 0; iy < this.AMOUNTY; iy ++ ) {
              this.particle = this.particles[ i++ ];
              this.particle.position.y = this.current_state[ix][iy] * 50;
              this.particle.scale.x = this.particle.scale.y = 5;

              /*
              this.particle.position.y = ( Math.sin( ( ix + this.count ) * 0.3 ) * 50 ) +
                  ( Math.sin( ( iy + this.count ) * 0.5 ) * 50 );
              this.particle.scale.x = this.particle.scale.y = 5;
              this.particle.scale.x = this.particle.scale.y = 
                  ( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 4 +
                  ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 4;
               */
          }
      }
      this.renderer.render( this.scene, this.camera );
      this.count += 0.1;
  }
  set_state(vals: number[][]) {
    this.current_state = vals;
  }
}


function run(el, binding) {

  let SEPARATION = 100, AMOUNTX = 10, AMOUNTY = 10;

  let container, stats;
  let camera, scene, renderer;

  let particles, particle, count = 0;

  let mouseX = 0, mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  init();
  animate();

  function init() {


      container = el;
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 1000;

      scene = new THREE.Scene();

      particles = new Array();

      let PI2 = Math.PI * 2;
      let material = new THREE.SpriteCanvasMaterial( {

          color: 0xffffff,
          program: function ( context ) {

              context.beginPath();
              context.arc( 0, 0, 0.5, 0, PI2, true );
              context.fill();

          }

      } );

      let i = 0;

      for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

          for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

              particle = particles[ i ++ ] = new THREE.Sprite( material );
              particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
              particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
              scene.add( particle );

          }

      }

      renderer = new THREE.CanvasRenderer();
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

      stats = new Stats();
      container.appendChild( stats.dom );

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      document.addEventListener( 'touchstart', onDocumentTouchStart, false );
      document.addEventListener( 'touchmove', onDocumentTouchMove, false );

      //

      window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  function onDocumentMouseMove( event ) {

      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

  }

  function onDocumentTouchStart( event ) {

      if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          mouseY = event.touches[ 0 ].pageY - windowHalfY;

      }

  }

  function onDocumentTouchMove( event ) {

      if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          mouseY = event.touches[ 0 ].pageY - windowHalfY;

      }

  }

  //

  function animate() {

      requestAnimationFrame( animate );

      render();
      stats.update();

  }

  function render() {

      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - mouseY - camera.position.y ) * .05;
      camera.lookAt( scene.position );

      let i = 0;

      for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

          for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

              particle = particles[ i++ ];
              particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                  ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
              particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
                  ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;

          }

      }

      renderer.render( scene, camera );

      count += 0.1;

  }

}

// -----------------
let internal_state = null;

function animate() {
  requestAnimationFrame(animate);
  internal_state.render();
  internal_state.stats.update();
}

export default {
  // When the bound element is inserted into the DOM...
  inserted: function(el, binding) {
    // _$(el).append('<div style="background-color:green;height:100px;width:200px;" />');
    // run(el, binding);
    internal_state = new ThreeAppContainer();
    internal_state.init(el, binding);
    animate();
    (<any>window).ginternal = internal_state;
    console.log('inserted');
  },
  unbind: function (el, binding) {
    console.log('unbind');
  },
  update: function (el, binding) {
    let vals = _.map(binding.value, ls => _.map(ls, parseFloat));
    internal_state.set_state(vals);
  }
};
