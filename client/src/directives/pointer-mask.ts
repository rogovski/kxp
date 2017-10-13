import { getBusRef } from '../runtime';

let d3 = (<any>window).d3;

const busRef = getBusRef();

function extract_dims(binding) {
  return binding.value.dims;
}
function extract_forward_addr(binding) {
  return binding.value.forward_message;
}
function valid_box(res) {
  let bus_payload = {
    w: 0, h: 0, x: 0, y: 0
  };
  if (res.length === 1 && res[0][0] !== null) {
    let w = res.attr('width') || 0;
    let h = res.attr('height') || 0;
    let x = res.attr('x') || 0;
    let y = res.attr('y') || 0;
    bus_payload = {
      w: parseFloat(w),
      h: parseFloat(h),
      x: parseFloat(x),
      y: parseFloat(y)
    };
  }
  if (bus_payload.w <= 5) {
    return false;
  }
  if (bus_payload.h <= 5) {
    return false;
  }
  return bus_payload;
}

function get_default_rect() {
  return {
    rx: 6,
    ry: 6,
    class: 'selection',
    x: null,
    y: null,
    width: 0,
    height: 0,
    'stroke-width': 3
  };
}
// a signle drawing 'session' consists of a mouse down, mouse move, mouse up events
// 
class RectBoxState {

  rect_box: any;
  isDrawing: any;
  px: any;
  py: any;
  mx: any;
  my: any;
  bbx: any;
  bby: any;
  bbw: any;
  bbh: any;

  constructor() {
    this.rect_box = get_default_rect();
    this.isDrawing = false;
    // instantanios mouse pointer position
    this.px = null;
    this.py = null;
    // position were mouse was firsted clicked. this defines a coordinate system
    this.mx = null;
    this.my = null;
    // computed bbox
    this.bbx = 0;
    this.bby = 0;
    this.bbw = 0;
    this.bbh = 0;
  }

  get_x1y1wh() {
    return {
      rx: 6,
      ry: 6,
      class: 'selection',
      x: this.bbx,
      y: this.bby,
      width: this.bbw,
      height: this.bbh,
      'stroke-width': 3
    };
  }

  drag_start(px, py) {
    this.px = px;
    this.py = py;
    this.mx = px;
    this.my = py;
  }
  
  handle_drag(px, py) {
    let old_px = this.px;
    let old_py = this.py;
    let d_px = px - this.px;
    let d_py = py - this.py;
    this.px = px;
    this.py = py;
    if (this.px > this.mx && this.py < this.my) {
      // q1
      this.bbx = this.mx;
      this.bby = this.py;
      this.bbw = this.px - this.mx;
      this.bbh = this.my - this.py;
      return;
    }
    if (this.px < this.mx && this.py < this.my) {
      // q2
      this.bbx = this.px;
      this.bby = this.py;
      this.bbw = this.mx - this.px;
      this.bbh = this.my - this.py;
      return;
    }
    if (this.px < this.mx && this.py > this.my) {
      // q3
      this.bbx = this.px;
      this.bby = this.my;
      this.bbw = this.mx - this.px;
      this.bbh = this.py - this.my;
      return;
    }
    if (this.px > this.mx && this.py > this.my) {
      // q4
      this.bbx = this.mx;
      this.bby = this.my;
      this.bbw = this.px - this.mx;
      this.bbh = this.py - this.my;
      return;
    }

  }

  get_cursor_point() {
    return { x: this.px, y: this.py };
  }

  set_drawing() {
    this.isDrawing = true;
  }

  set_idle() {
    this.isDrawing = false;
  }

  valid_box() {
    if (this.bbw > 5 && this.bbh > 5) {
      let { x, y, width, height } = this.get_x1y1wh();
      return { x: x, y: y, w: width, h: height };
    }
    return false;
  }

  reset_box() {
    this.px = null;
    this.py = null;
    this.mx = null;
    this.my = null;
    this.bbx = 0;
    this.bby = 0;
    this.bbw = 0;
    this.bbh = 0;
  }
}

const rbs = new RectBoxState();
// window.grbs = rbs;

function on_change(el, binding) {
  const { height, width } = extract_dims(binding);
  const forward_message = extract_forward_addr(binding);
  // window.maskEl = el;
  let svg = d3.select(el)
    .append('svg')
    .attr('width', `${width}px`)
    .attr('height', `${height}px`);    

  rbs.reset_box();
  rbs.set_idle();

  svg
    .on( 'mousedown', function(e) {
      let p = d3.mouse(this);
      rbs.set_drawing();
      rbs.drag_start(p[0], p[1]);

      svg.append('rect')
        .attr(rbs.get_x1y1wh());
    })
    .on( 'mousemove', function() {
      if (rbs.isDrawing) {
        let p = d3.mouse(this);
        rbs.handle_drag(p[0], p[1]); 
        let s = svg.select( 'rect.selection');
        if (!s.empty()) {
          s.attr(rbs.get_x1y1wh());
        }
      }
  })
  .on( 'mouseup', function() {
    // remove selection frame
    let bus_payload = rbs.valid_box(); 
    rbs.reset_box();
    rbs.set_idle();
    let res = svg.select( 'rect.selection');
    res.remove();
    if (bus_payload) {
      let message = {
        bus_message: 'ATTACH_BBOX',
        forward_message: forward_message,
        payload: bus_payload
      };
      busRef.emit('data', message);
    }
  })
  .on( 'mouseout', function() {
    let relatedTarget = d3.event.relatedTarget;
    if (relatedTarget !== null) {
      let container = relatedTarget.tagName;
      let on_outer = (container !== 'rect' && container !== 'svg');
      if (rbs.isDrawing && on_outer) {
        rbs.reset_box();
        rbs.set_idle();
        svg.selectAll( 'rect.selection').remove();
      }
    }
  });
}

function on_update(el, binding) {
  let child = el.children[0];
  el.removeChild(child);
  on_change(el, binding);
}

export default {
  inserted: on_change,
  update: on_update 
};
