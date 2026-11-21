package com.mynewrnapp2025

import android.media.AudioManager
import com.facebook.react.bridge.*

class AudioDiagnosticsModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "AudioDiagnostics"
  }

  @ReactMethod
  fun getOutputSampleRate(promise: Promise) {
    try {
      val audioManager = reactContext.getSystemService(ReactApplicationContext.AUDIO_SERVICE) as AudioManager
      val sampleRate = audioManager.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE)
      promise.resolve(sampleRate)
    } catch (e: Exception) {
      promise.reject("SAMPLE_RATE_ERROR", "Failed to get output sample rate", e)
    }
  }
}
