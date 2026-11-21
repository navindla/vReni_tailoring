//// v3 has 2 funcs 2nd func has bug


package com.mynewrnapp2025

import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.media.audiofx.BassBoost
import com.facebook.react.bridge.Promise


import android.content.Context
import android.media.MediaPlayer
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AudioPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    private var bassBoost: BassBoost? = null
    private var currentOutput: String = "Unknown"


    override fun getName(): String {
        return "AudioPlayer"
    }

   
    @ReactMethod
fun playAudio() {
    val resId = reactContext.resources.getIdentifier("song", "raw", reactContext.packageName)
    mediaPlayer?.release()
    bassBoost?.release()

    mediaPlayer = MediaPlayer.create(reactContext, resId)

    val sessionId = mediaPlayer?.audioSessionId ?: 0
    bassBoost = BassBoost(0, sessionId)
    bassBoost?.enabled = true

    // Apply bass based on previous output detection
    when (currentOutput) {
        "Wired Headphones" -> bassBoost?.setStrength(1000.toShort())
        "Speaker" -> bassBoost?.setStrength(400.toShort())
        else -> bassBoost?.setStrength(0.toShort()) // Disable or keep low for Bluetooth
    }

    mediaPlayer?.start()
}

    @ReactMethod
fun getAudioOutputDevice(promise: Promise) {
    try {
        val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val outputDevices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)

        for (device in outputDevices) {
            when (device.type) {
                AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
                AudioDeviceInfo.TYPE_BLUETOOTH_SCO -> {
                    currentOutput = "Bluetooth Headset"
                    promise.resolve(currentOutput)
                    return
                }
                AudioDeviceInfo.TYPE_WIRED_HEADPHONES,
                AudioDeviceInfo.TYPE_WIRED_HEADSET -> {
                    currentOutput = "Wired Headphones"
                    promise.resolve(currentOutput)
                    return
                }
                AudioDeviceInfo.TYPE_USB_HEADSET -> {
                    currentOutput = "USB Headset"
                    promise.resolve(currentOutput)
                    return
                }
                AudioDeviceInfo.TYPE_HDMI,
                AudioDeviceInfo.TYPE_HDMI_ARC -> {
                    currentOutput = "HDMI Output"
                    promise.resolve(currentOutput)
                    return
                }
                AudioDeviceInfo.TYPE_BUILTIN_SPEAKER -> {
                    currentOutput = "Speaker"
                    promise.resolve(currentOutput)
                    return
                }
            }
        }

        currentOutput = "Unknown"
        promise.resolve(currentOutput)
    } catch (e: Exception) {
        promise.reject("AUDIO_ERROR", "Failed to detect output", e)
    }
}

}
