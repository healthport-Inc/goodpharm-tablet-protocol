package com.goodpharmtabletprotocol;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Base64;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.*;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.goodpharmtabletprotocol.VORepository.SocketVO;
import com.goodpharmtabletprotocol.service.SocketCommService;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import java.io.PrintWriter;
import java.security.Key;

import static com.goodpharmtabletprotocol.Globals.socketVOList;

public class GoodpharmTabletProtocolModule extends ReactContextBaseJavaModule {
  public final String CLASS_NAME = "GoodpharmTabletProtocol";
  private ReactApplicationContext applicationContext;

  private Intent mGoodpharmSocketServiceIntent = null;
  private SocketCommService mSocketCommService;
  DeviceEventManagerModule.RCTDeviceEventEmitter jsModule;

  public Activity bindingActivity;

  public GoodpharmTabletProtocolModule(ReactApplicationContext reactContext) {
    super(reactContext);
    applicationContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return CLASS_NAME;
  }

  public static String key() {
    return "goodpha!";
  }

  private static Key getKey(String keyValue) throws Exception {
    DESKeySpec desKeySpec = new DESKeySpec(keyValue.getBytes());
    SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
    Key key = keyFactory.generateSecret(desKeySpec);
    return key;
  }

  private ServiceConnection mServiceConnection = new ServiceConnection() {
    public void onServiceConnected(ComponentName name, IBinder service) {
      // 서비스와 연결되었을 때 호출되는 메서드 서비스 객체를 전역변수로 저장
      SocketCommService.SocketBinder mb = (SocketCommService.SocketBinder) service;
      mSocketCommService = mb.getService(); // 서비스가 제공하는 메소드 호출하여 서비스쪽 객체를 전달받을수 있슴
    }

    public void onServiceDisconnected(ComponentName name) {
      WritableMap params = Arguments.createMap();
      params.putBoolean("status", false);
      applicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("serviceStatus", params);
    }
  };

  @ReactMethod
  public void initSocketService() {
    bindingActivity = getCurrentActivity();
    mGoodpharmSocketServiceIntent = new Intent(bindingActivity, SocketCommService.class);
    bindingActivity.bindService(mGoodpharmSocketServiceIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
  }

  @ReactMethod
  public void closeSocketService() {
    if (bindingActivity != null) {
      bindingActivity.unbindService(mServiceConnection);
    }
  }

  @ReactMethod
  public void resetSocketService() {
    closeSocketService();
    initSocketService();
  }


  @ReactMethod
  public static void sendPacket(String packet) {
    for (SocketVO item : socketVOList) {
      try {
        PrintWriter socketOut = item.socketOut;
        socketOut.write(packet + "\r\n");
        socketOut.flush();
      } catch (Exception e) {
        Globals.onCloseClient(item);
        e.printStackTrace();
      }
    }
  }


  @ReactMethod
  public static void encrypt(String string, Promise promise) {
    try {
      if (string == null || string.length() == 0) {
        promise.resolve(null);
      }

      String instance = "DES/ECB/PKCS5Padding";
      javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(instance);
      cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, getKey(key()));
      String amalgam = string;

      byte[] inputBytes1 = amalgam.getBytes("UTF8");
      byte[] outputBytes1 = cipher.doFinal(inputBytes1);
      byte[] convertedBase64 = Base64.encode(outputBytes1, Base64.NO_WRAP);
      String outputStr1 = new String(convertedBase64, "UTF8");

      promise.resolve(outputStr1);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  private static void decrypt(String encryptedString, Promise promise) {
    try {
      if (encryptedString == null || encryptedString.length() == 0) {
        promise.resolve(null);
      }

      String instance = "DES/ECB/PKCS5Padding";
      javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(instance);
      cipher.init(javax.crypto.Cipher.DECRYPT_MODE, getKey(key()));

      byte[] inputBytes1 = Base64.decode(encryptedString, Base64.DEFAULT);
      byte[] outputBytes2 = cipher.doFinal(inputBytes1);

      String strResult = new String(outputBytes2, "UTF8");
      promise.resolve(strResult);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  private static void getSocketStatus(Promise promise) {
    try {
      WritableMap map = Arguments.createMap();

      map.putBoolean("socketStatus", Globals.socketStatus);

      promise.resolve(map);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  private static void getSocketCount(Promise promise) {
    try {
      WritableMap map = Arguments.createMap();

      map.putInt("socketCount", socketVOList.size());

      promise.resolve(map);
    } catch (Exception e) {
      promise.reject(e);
    }
  }
}
