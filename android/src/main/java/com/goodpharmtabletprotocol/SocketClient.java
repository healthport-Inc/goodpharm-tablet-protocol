package com.goodpharmtabletprotocol;

import android.util.Log;

import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


public class SocketClient {

  private Socket socket;
  private String key;

  public static boolean socketStatus = false;
  public static List<SocketClient> socketClientList = new ArrayList<>();

  private SocketClient(Socket client) {
    this.socket = client;
    this.key = "" + client.getPort() + client.getLocalAddress() + client.getRemoteSocketAddress().toString() + client.toString();
    Log.d("dotdot", key);
  }


  private int getSocket(Socket client) {
    for (int i = 0; i < socketClientList.size(); i++) {
      if (socketClientList.get(i).socket == client) {
        return i;
      }
    }
    return -1;
  }

  private int getSocket(String key) {
    for (int i = 0; i < socketClientList.size(); i++) {
      if(socketClientList.get(i).key.equals(key)) {
        return i;
      }
    }
    return -1;
  }

  public SocketClient getInstance(Socket client) {

    SocketClient  socketClient = new SocketClient(client);
    if(socketClientList.contains(socketClient)) {
      int index2 = socketClientList.indexOf(socketClient);
    }
    int index = getSocket(client);
    if (index != -1) {
      return socketClientList.get(index);
    } else {
      SocketClient instance = new SocketClient(client);
      socketClientList.add(instance);
      return instance;
    }
  }

  public SocketClient getInstance(String key) throws Exception {
    int index = 0;
    for (SocketClient socketClient : socketClientList) {
      if (socketClient.key == key) {
        break;
      } else {
        index++;
      }
    }

    if (index != -1) {
      return socketClientList.get(index);
    } else {
      throw new Exception("not exist socket");
    }
  }

  public void onCloseClient() {
    try {
      this.socket.getOutputStream().close();
      this.socket.getInputStream().close();
      this.socket.close();
    } catch (Exception ec) {
    } finally {
      socketClientList.remove(this);
    }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SocketClient that = (SocketClient) o;
    return Objects.equals(socket, that.socket) &&
      Objects.equals(key, that.key);
  }

  @Override
  public int hashCode() {
      return Objects.hash(socket, key);
  }
}
