/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createTechnoDrumKit = () => {
  // Create a punchy techno kick
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 7,
    oscillator: {
      type: 'triangle',
    },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 0.4,
    },
  })

  // Create resonant hihat for techno feel
  const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.01,
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 1000,
    octaves: 1.5,
  })

  // Create clap with more electronic character
  const clap = new Tone.NoiseSynth({
    noise: {
      type: 'pink',
      playbackRate: 3,
    },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0.2,
    },
  })

  // Create rim shot for accent
  const rim = new Tone.MetalSynth({
    frequency: 800,
    envelope: {
      attack: 0.001,
      decay: 0.05,
      release: 0.05,
    },
    harmonicity: 3.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 1,
  })

  // Effects chain
  const kickComp = new Tone.Compressor({
    threshold: -24,
    ratio: 6,
    attack: 0.003,
    release: 0.25,
  }).toDestination()

  const effectsChannel = new Tone.Channel({
    volume: -12,
    pan: 0,
  }).toDestination()

  // Connect everything
  kick.connect(kickComp)
  hihat.connect(effectsChannel)
  clap.connect(effectsChannel)
  rim.connect(effectsChannel)

  return { kick, hihat, clap, rim }
}

const TechnoDrumButton = (props) => {
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
      if (instrumentsRef.current) {
        Object.values(instrumentsRef.current).forEach((instrument) => {
          instrument.dispose()
        })
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!instrumentsRef.current) {
      instrumentsRef.current = createTechnoDrumKit()
    }

    if (!patternsRef.current) {
      patternsRef.current = {
        // Steady marching kick pattern
        kick: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.kick.triggerAttackRelease(
              'C1',
              '8n',
              time,
              1
            )
          },
          [1, null, 1, null, 1, null, 1, null],
          '8n'
        ),

        // Hi-hat pattern with techno rhythm
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
          [0.8, 0.4, 0.8, 0.4, 0.8, 0.4, 0.8, 0.4],
          '16n'
        ),

        // Clap on 2 and 4
        clap: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.clap.triggerAttackRelease('16n', time)
          },
          [null, null, 1, null, null, null, 1, null],
          '8n'
        ),

        // Rim accent pattern
        rim: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.rim.triggerAttackRelease(
              'C5',
              '16n',
              time,
              0.3
            )
          },
          [null, null, null, 1, null, null, null, 1],
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
      Tone.Transport.bpm.value = 128 // Set to specified 128 BPM
      Object.values(patternsRef.current).forEach((pattern) => pattern.start(0))
    } else {
      Object.values(patternsRef.current).forEach((pattern) => pattern.stop())
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${props.className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? 'Stop Techno Beat' : 'Play Techno Beat'}
    </Button>
  )
}

export default TechnoDrumButton
