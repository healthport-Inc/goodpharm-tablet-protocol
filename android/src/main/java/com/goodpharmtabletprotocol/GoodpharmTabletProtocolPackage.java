// package com.goodpharmtabletprotocol

// import java.util.Arrays
// import java.util.Collections

// import com.facebook.react.ReactPackage
// import com.facebook.react.bridge.NativeModule
// import com.facebook.react.bridge.ReactApplicationContext
// import com.facebook.react.uimanager.ViewManager
// import com.facebook.react.bridge.JavaScriptModule

// class GoodpharmTabletProtocolPackage : ReactPackage {
//     override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
//         return Arrays.asList<NativeModule>(GoodpharmTabletProtocolModule(reactContext))
//     }

//     override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
//         return emptyList<ViewManager<*, *>>()
//     }
// }


package com.goodpharmtabletprotocol;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GoodpharmTabletProtocolPackage implements ReactPackage {

  public static GoodpharmTabletProtocolModule mGoodpharmTabletProtocolModule;

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    mGoodpharmTabletProtocolModule = new GoodpharmTabletProtocolModule(reactContext);
    modules.add(mGoodpharmTabletProtocolModule);
    return modules;
  }
}
