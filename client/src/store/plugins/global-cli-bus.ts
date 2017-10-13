import uuid from 'node-uuid';

export default function (bus) {
  return store => {
    bus.on('data', data => {
      switch (data.bus_message) {
        case 'ATTACH_BBOX':
          let forward_message = data.forward_message;
          let payload = data.payload;
          payload.box_id = uuid.v4();
          store.commit(forward_message, payload);
          break;
        default:
          break;
      }
    });
  };
}
