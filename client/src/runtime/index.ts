let ws_instance = (<any>window).io({ path: '/events', autoConnect: false });

export function getWsRef() {
  return ws_instance;
}

export function connectWsRef() {
  if (!ws_instance.connected) {
    ws_instance.connect();
  }
}

export function disconnectWsRef() {
  if (ws_instance.connected) {
    ws_instance.close();
  }
}