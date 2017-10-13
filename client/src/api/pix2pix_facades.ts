import axios from 'axios';

export function persistLabelsToWorkspace(drawnComponents) {
  return axios.post('/pix2pix/facades/lbl/workspace', { 
    labels: drawnComponents
  })
  .then(res => {
    let resjson = JSON.parse(res.data);
    return resjson.data;
  });
}

