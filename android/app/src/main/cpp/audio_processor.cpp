// audio_processor.cpp

// audio_processor.cpp

#include <jni.h>                    // Required for JNI types
#include "HarmonicEnhancer.h"       // Your DSP class
#include <cmath>                    // Required by HarmonicEnhancer (tanh)

static HarmonicEnhancer enhancer(3200.0f, 44100.0f);

extern "C"
JNIEXPORT jfloat JNICALL
Java_com_mynewrnapp2025_AudioDSPModule_processSample(JNIEnv *env, jobject thiz, jfloat input) {
    return enhancer.process(input, 2.0f, 0.7f);  // drive = 2.0, mix = 0.7
}
