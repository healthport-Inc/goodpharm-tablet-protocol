package com.goodpharmtabletprotocol.service;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;

import android.util.Log;
import androidx.annotation.WorkerThread;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.goodpharmtabletprotocol.Globals;
import com.goodpharmtabletprotocol.VORepository.SocketVO;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import static com.goodpharmtabletprotocol.Globals.socketVOList;


public class SocketCommService extends Service {
  private final IBinder mBinder = new SocketBinder();

  private ServerSocket mServerSocket = null;
  private final int SOCKET_TIMEOUT = 5 * 60 * 1000; // 5분 동안 재 연결 없으면
  private final int SOCKET_PORT_NUMBER = 30300;

  Context svContext;
  DeviceEventManagerModule.RCTDeviceEventEmitter jsModule;

  @Override
  public IBinder onBind(Intent intent) {
    return mBinder;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    svContext = getApplicationContext();
    jsModule = ((ReactApplication) svContext).getReactNativeHost().getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    onConnectSocket();

    WritableMap params = Arguments.createMap(); // add here the data you want to
    params.putBoolean("status", true);
    jsModule.emit("serviceStatus", params);
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    for (SocketVO item : socketVOList) {
      try {
        Globals.onCloseClient(item);
      } catch (Exception e) {
        e.getStackTrace().toString();
        e.printStackTrace();
      }
    }
    socketVOList.clear();
    onCloseSocket();

    WritableMap params = Arguments.createMap(); // add here the data you want to
    params.putBoolean("status", false);
    jsModule.emit("serviceStatus", params);
  }

  @WorkerThread
  private void onConnectSocket() {
    Thread mThread2 = new Thread() {
      @Override
      public void run() { // 소켓 서버 쓰레드
        try {
          mServerSocket = new ServerSocket(SOCKET_PORT_NUMBER);

          sendSocketLog("서버 소켓 스타트 " + " , " + mServerSocket.toString());
          mServerSocket.setReuseAddress(true);
          mServerSocket.getSoTimeout();
          while (true) { // 소켓 서버 안 닫히게 유지
            SocketVO socketVO = null;
            Socket client = mServerSocket.accept();

            client.setKeepAlive(true);
            client.setReuseAddress(true);
            client.setSoLinger(true, 0);
            client.setTcpNoDelay(true);
            client.setSoTimeout(SOCKET_TIMEOUT);
            BufferedReader bufReader = new BufferedReader(new InputStreamReader(client.getInputStream()));

            PrintWriter socketOut = new PrintWriter(client.getOutputStream(), true);

            socketVO = new SocketVO(client, bufReader, socketOut);
            socketVOList.add(socketVO);

            sendSocketLog("소켓 리스트 갯수: " + socketVOList.size() + "개" + "  " + client.toString());

            // Socket thread
            SocketVO finalSocketVO = socketVO;
            Thread mThread = new Thread() {
              @Override
              public void run() {
                try {
                  while (true) {
                    final String line = bufReader.readLine();
                    if (line == null)
                      break;
                    Log.d("dotdot", line);
                    WritableMap packetParams = Arguments.createMap(); // add here the data you want to
                    // 패킷 수신
                    sendSocketLog("태블릿이 파라미터 받음 " + line.replace("&", "?"));
                    packetParams.putString("packet", line.trim());
                    jsModule.emit("receivePacket", packetParams);
                  }
                  sendSocketLog("정상 연결종료");
                } catch (IOException e) {
                  sendSocketLog("소켓 서버 IOException", e);
                  e.printStackTrace();
                } catch (Exception e) {
                  sendSocketLog("소켓 서버 IOException", e);
                  e.printStackTrace();
                } finally {
                  Globals.onCloseClient(finalSocketVO);
                }
              }
            };

            mThread.start();

          }
        } catch (IOException e) {
          sendSocketLog("소켓 서버 IOException", e);
          e.printStackTrace();
        } catch (Exception e) {
          sendSocketLog("소켓 서버 Exception", e);
          e.printStackTrace();
        } finally {
//          mGoodpharmTabletProtocolModule.resetSocketService();
        }
      }
    };
    mThread2.start();
  }

  public class SocketBinder extends Binder {
    public SocketCommService getService() {
      return SocketCommService.this;
    }
  }

  private void onCloseSocket() {
    try {
      if (mServerSocket != null) {
        sendSocketLog("서버 소켓 닫힘 " + mServerSocket.toString());
        mServerSocket.close();
      }
    } catch (Exception e) {
      sendSocketLog("onCloseSocket() :", e);
    }
  }

  private void sendSocketLog(String msg, Exception e) {
    WritableMap errorParams = Arguments.createMap();
    String error = e.getStackTrace().toString();
    errorParams.putString("msg", msg);
    errorParams.putString("error", error);
    jsModule.emit("socketLog", errorParams);
  }

  private void sendSocketLog(String msg) {
    WritableMap params = Arguments.createMap();
    params.putString("msg", msg);
    jsModule.emit("socketLog", params);
  }

}
