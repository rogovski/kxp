export default function (ws) {
  return store => {
    ws.on('event_data', data => {
      console.log('event_data', data);
    });
  };
}