import { Client } from '@stomp/stompjs';

class MainWebSocket {
  url: string;
  client: Client;

  constructor(url: string) {
    this.url = url;
    this.client = new Client({ brokerURL: url });
  }

  public connect() {
    this.client.activate();
    this.client.reconnectDelay = 1000;
  }
}

/**
 * Фабричный метод
 * @param url ws endpoint
 * @returns {MainWebSocket}
 */
function factoryWebSocket(url: string): MainWebSocket {
  return new MainWebSocket(url);
}

export const webSocketClient = factoryWebSocket;
