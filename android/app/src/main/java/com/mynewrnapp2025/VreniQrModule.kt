
package com.mynewrnapp2025

import android.graphics.Bitmap
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import java.io.ByteArrayOutputStream

class VreniQrModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "VreniQr"

    @ReactMethod
    fun generateQr(
        value: String,
        size: Int,
        promise: Promise
    ) {
        try {
            if (value.isBlank()) {
                promise.reject("INVALID_VALUE", "QR value cannot be empty")
                return
            }

            if (size !in 128..1024) {
                promise.reject(
                    "INVALID_SIZE",
                    "QR size must be between 128 and 1024"
                )
                return
            }

            val hints = mapOf(
                EncodeHintType.MARGIN to 2,
                EncodeHintType.ERROR_CORRECTION to ErrorCorrectionLevel.M
            )

            val matrix = QRCodeWriter().encode(
                value,
                BarcodeFormat.QR_CODE,
                size,
                size,
                hints
            )

            val bitmap = Bitmap.createBitmap(
                size,
                size,
                Bitmap.Config.ARGB_8888
            )

            for (x in 0 until size) {
                for (y in 0 until size) {
                    bitmap.setPixel(
                        x,
                        y,
                        if (matrix[x, y]) {
                            android.graphics.Color.BLACK
                        } else {
                            android.graphics.Color.WHITE
                        }
                    )
                }
            }

            val output = ByteArrayOutputStream()

            bitmap.compress(
                Bitmap.CompressFormat.PNG,
                100,
                output
            )

            bitmap.recycle()

            val base64 = Base64.encodeToString(
                output.toByteArray(),
                Base64.NO_WRAP
            )

            promise.resolve(base64)

        } catch (exception: Exception) {
            promise.reject(
                "QR_GENERATION_FAILED",
                exception.message,
                exception
            )
        }
    }
}
