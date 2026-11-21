


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
import android.util.Log



class AudioPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    private var bassBoost: BassBoost? = null
    private var currentBassStrength: Int = 0 // Store last set bass
    private var currentOutput: String = "Unknown"

    override fun getName(): String = "AudioPlayer"

    @ReactMethod
    fun playAudio() {
        try {
            val resId = reactContext.resources.getIdentifier("song", "raw", reactContext.packageName)
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null

            bassBoost?.release()
            bassBoost = null

            mediaPlayer = MediaPlayer.create(reactContext, resId)
            val sessionId = mediaPlayer?.audioSessionId ?: 0

            bassBoost = BassBoost(0, sessionId)
            bassBoost?.enabled = true
            bassBoost?.setStrength(currentBassStrength.coerceIn(0, 1000).toShort())

            mediaPlayer?.setOnCompletionListener {
                // Clean up after playback if needed
                stopAudio()
            }

            mediaPlayer?.start()
        } catch (e: Exception) {
            Log.e("AudioPlayer", "Failed to play audio: ${e.message}")
        }
    }



    @ReactMethod
fun playAudioFromPath(filePath: String) {
    try {
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null

        bassBoost?.release()
        bassBoost = null

        mediaPlayer = MediaPlayer().apply {
            setDataSource(filePath)
            prepare()
        }

        val sessionId = mediaPlayer?.audioSessionId ?: 0
        bassBoost = BassBoost(0, sessionId).apply {
            enabled = true
            setStrength(currentBassStrength.coerceIn(0, 1000).toShort())
        }

        mediaPlayer?.setOnCompletionListener {
            stopAudio() // Optional cleanup
        }

        mediaPlayer?.start()

    } catch (e: Exception) {
        Log.e("AudioPlayer", "Failed to play from path: ${e.message}")
    }
}




    @ReactMethod
    fun setBassStrength(strength: Int) {
        try {
            currentBassStrength = strength.coerceIn(0, 1000)
            bassBoost?.setStrength(currentBassStrength.toShort())
        } catch (e: Exception) {
            Log.e("BassBoost", "Failed to set bass strength: ${e.message}")
        }
    }

    @ReactMethod
    fun getAudioOutputDevice(promise: Promise) {
        try {
            val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager

            val commDevice = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                audioManager.communicationDevice
            } else null

            val outputName = when (commDevice?.type) {
                AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
                AudioDeviceInfo.TYPE_BLUETOOTH_SCO -> "Bluetooth Headset"
                AudioDeviceInfo.TYPE_WIRED_HEADPHONES,
                AudioDeviceInfo.TYPE_WIRED_HEADSET -> "Wired Headphones"
                AudioDeviceInfo.TYPE_USB_HEADSET -> "USB Headset"
                AudioDeviceInfo.TYPE_HDMI,
                AudioDeviceInfo.TYPE_HDMI_ARC -> "HDMI Output"
                AudioDeviceInfo.TYPE_BUILTIN_SPEAKER -> "Speaker"
                else -> {
                    if (audioManager.isWiredHeadsetOn) "Wired Headphones"
                    else "Speaker"
                }
            }

            promise.resolve(outputName)
        } catch (e: Exception) {
            promise.reject("AUDIO_ERROR", "Failed to detect output", e)
        }
    }

    @ReactMethod
    fun stopAudio() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null

            bassBoost?.release()
            bassBoost = null
        } catch (e: Exception) {
            Log.e("AudioPlayer", "Failed to stop audio: ${e.message}")
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopAudio()
    }





}

