// HarmonicEnhancer.h

#pragma once
#include <cmath>
#include <algorithm>

class HarmonicEnhancer {
public:
    HarmonicEnhancer(float crossoverFreq, float sampleRate)
        : crossoverFreq(crossoverFreq), sampleRate(sampleRate) {
        float RC = 1.0f / (2.0f * M_PI * crossoverFreq);
        alpha = RC / (RC + 1.0f / sampleRate);
        prevInput = 0.0f;
        prevOutput = 0.0f;
    }

    float process(float input, float drive = 1.0f, float mix = 0.5f) {
        float hp = alpha * (prevOutput + input - prevInput);
        prevInput = input;
        prevOutput = hp;
        float enhanced = softClip(hp * drive);
        return input + mix * (enhanced - hp);
    }

private:
    float crossoverFreq;
    float sampleRate;
    float alpha;
    float prevInput;
    float prevOutput;

    float softClip(float x) {
        return std::tanh(x);
    }
};
