package com.summitcodeworks.triviaa

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Triviaa"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

//        if (FirebaseApp.getApps(this).isEmpty()) {
//            val options = FirebaseOptions.Builder()
//                .setApplicationId("1:596817273399:web:cf9dd29c7a0ec3992d15b2")
//                .setApiKey("AIzaSyC1m6YjmpcCZjaZjLCllfktQSkjI6k22CY")
//                .setProjectId("triviaa-14824")
//                .setGcmSenderId("596817273399")
//                .setStorageBucket("triviaa-14824.firebasestorage.app")
//                .build()
//
//            FirebaseApp.initializeApp(this, options)
//        }

        if (FirebaseApp.getApps(this).isEmpty()) {
        //val options = FirebaseOptions.Builder()
        val options = FirebaseOptions.Builder()
                        .setApplicationId("1:596817273399:web:cf9dd29c7a0ec3992d15b2")
                        .setApiKey("AIzaSyC1m6YjmpcCZjaZjLCllfktQSkjI6k22CY")
                        .setProjectId("triviaa-14824")
                       .setGcmSenderId("596817273399")
                        .setStorageBucket("gs://triviaa-14824.firebasestorage.app")
                        .build()
            FirebaseApp.initializeApp(this, options)
        }
    }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
