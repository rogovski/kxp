export default function (ws) {
  return store => {
    ws.on('event_data', data => {
      store.commit('ws/event/DATA', data);
    });
  };
}