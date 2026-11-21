///// v 1 with 1st feature

package com.mynewrnapp2025

import android.content.Context
import android.media.MediaPlayer
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AudioPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null

    override fun getName(): String {
        return "AudioPlayer"
    }

    @ReactMethod
    fun playAudio() {
        val resId = reactContext.resources.getIdentifier("song", "raw", reactContext.packageName)
        mediaPlayer?.release()
        mediaPlayer = MediaPlayer.create(reactContext, resId)
        mediaPlayer?.start()
    }
}
