export interface Pix2PixFacadesState {
  selectedArchComponent: string;
  drawnComponents: ArchComponent[];
}

export interface ArchComponent {
  x: number;
  y: number;
  w: number;
  h: number;
  box_id: number;
  tag: number;
  z_index: number;
  bgstyle: string;
}
