cmake_minimum_required(VERSION 3.4.1)
project(harmonic_enhancer)

add_library(
    harmonic_enhancer
    SHARED
    audio_processor.cpp
    HarmonicEnhancer.h
)

find_library(
    log-lib
    log
)

target_link_libraries(
    harmonic_enhancer
    ${log-lib}
)
