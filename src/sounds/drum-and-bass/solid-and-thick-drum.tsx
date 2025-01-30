/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createThickDrumKit = () => {
  // Create a thicker, more solid kick
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
    },
  }).toDestination()

  // Add compression to make it more solid
  const kickCompressor = new Tone.Compressor({
    threshold: -24,
    ratio: 12,
    attack: 0.003,
    release: 0.25,
  }).toDestination()
  kick.connect(kickCompressor)

  // Create thick hihat
  const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.01,
    },
    harmonicity: 5.1,
    modulationIndex: 40,
    resonance: 3000,
    octaves: 1,
  }).toDestination()

  // Create a thicker clap sound
  const clap = new Tone.NoiseSynth({
    noise: {
      type: 'white',
      playbackRate: 0.1,
    },
    envelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.2,
    },
  }).toDestination()

  // Add distortion for thickness
  const distortion = new Tone.Distortion({
    distortion: 0.2,
    wet: 0.3,
  }).toDestination()
  clap.connect(distortion)

  return { kick, hihat, clap }
}

// TSP Beat Button component
const TSPBeatButton = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const instrumentsRef = useRef(null)
  const patternsRef = useRef(null)

  useEffect(() => {
    return () => {
      if (patternsRef.current) {
        Object.values(patternsRef.current).forEach((pattern) => {
          pattern.stop()
          pattern.dispose()
        })
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!instrumentsRef.current) {
      instrumentsRef.current = createThickDrumKit()
    }

    if (!patternsRef.current) {
      patternsRef.current = {
        // Solid kick pattern
        kick: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.kick.triggerAttackRelease(
              'C1',
              '8n',
              time,
              1
            )
          },
          [1, null, null, 1, null, 1, null, null],
          '8n'
        ),

        // Thick hihat pattern
        hihat: new Tone.Pattern(
          (time, velocity) => {
            if (velocity) {
              instrumentsRef.current.hihat.triggerAttackRelease(
                '32n',
                time,
                velocity * 0.5
              )
            }
          },
          [0.9, 0.5, 0.9, 0.5, 0.9, 0.5, 0.9, 0.5],
          '16n'
        ),

        // Solid clap pattern
        clap: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.clap.triggerAttackRelease('16n', time, 1)
          },
          [null, null, 1, null, null, null, 1, null],
          '8n'
        ),
      }
    }
  }

  const togglePlay = async () => {
    await initializeAudio()

    if (!isPlaying) {
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start()
      }
      Tone.Transport.bpm.value = 172 // Set to specified 172 BPM
      Object.values(patternsRef.current).forEach((pattern) => pattern.start(0))
    } else {
      Object.values(patternsRef.current).forEach((pattern) => pattern.stop())
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? 'Stop TSP Beat' : 'Play TSP Beat'}
    </Button>
  )
}

export default TSPBeatButton
