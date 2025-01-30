/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

// Shared instruments factory to avoid recreating instruments
const createInstruments = (type = 'default') => {
  const instruments = {
    kick: new Tone.MembraneSynth({
      envelope: { sustain: 0.1, attack: 0.02, decay: 0.2 },
      octaves: 4,
      pitchDecay: 0.05,
    }).toDestination(),

    hihat: new Tone.MetalSynth({
      frequency: type === 'dnb' ? 300 : 200,
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination(),

    clap: new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
    }).toDestination(),
  }

  // Adjust volumes based on type
  if (type === 'dnb') {
    instruments.kick.volume.value = -6
    instruments.hihat.volume.value = -12
  }

  return instruments
}

// Base BeatButton component
const BeatButton = ({ pattern, label, className, type = 'default' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const instrumentsRef = useRef(null)
  const patternsRef = useRef(null)

  useEffect(() => {
    // Cleanup function
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
      instrumentsRef.current = createInstruments(type)
    }

    if (!patternsRef.current) {
      patternsRef.current = {
        kick: new Tone.Pattern(
          (time) => {
            instrumentsRef.current.kick.triggerAttackRelease('C1', '8n', time)
          },
          pattern.kick,
          '8n'
        ),

        hihat: new Tone.Pattern(
          (time, velocity) => {
            if (velocity) {
              instrumentsRef.current.hihat.triggerAttackRelease(
                '32n',
                time,
                velocity * 0.3
              )
            }
          },
          pattern.hihat,
          '8n'
        ),

        clap: new Tone.Pattern(
          (time) => {
            if (time !== null) {
              instrumentsRef.current.clap.triggerAttackRelease('16n', time)
            }
          },
          pattern.clap,
          '8n'
        ),
      }
    }
  }

  const togglePlay = async () => {
    await initializeAudio()

    if (!isPlaying) {
      // Start global transport if it's not already running
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start()
      }
      Tone.Transport.bpm.value = 128

      // Start this pattern's sequences
      Object.values(patternsRef.current).forEach((pattern) => pattern.start(0))
    } else {
      // Stop only this pattern's sequences
      Object.values(patternsRef.current).forEach((pattern) => pattern.stop())
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? `${label}` : `${label}`}
    </Button>
  )
}

// Export individual beat buttons with specific patterns
export const MinimalTechnoButton = (props) => (
  <BeatButton
    pattern={{
      kick: [1, null, 1, null],
      hihat: [1, 1, 1, 1],
      clap: [1, null, 1, null],
    }}
    type='minimal'
    label='Box Beat'
    {...props}
  />
)

export const HouseButton = (props) => (
  <BeatButton
    pattern={{
      kick: [1, null, null, null, 1, null, null, null],
      hihat: [null, null, 1, null, null, null, 1, null],
      clap: [null, null, 1, null, null, null, 1, null],
    }}
    type='house'
    label='Box Beat'
    {...props}
  />
)

export const DnBButton = (props) => (
  <BeatButton
    pattern={{
      kick: [1, null, null, 1, null, null, 1, null],
      hihat: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
      clap: [null, null, 1, null, null, null, 1, null],
    }}
    type='dnb'
    label='Box Beat'
    {...props}
  />
)

export const BreakbeatButton = (props) => (
  <BeatButton
    pattern={{
      kick: [1, null, null, 1, null, 1, null, null],
      hihat: [1, 1, 0.5, 1, 1, 1, 0.5, 1],
      clap: [null, null, 1, null, null, null, 1, null],
    }}
    type='breakbeat'
    label='Box Beat'
    {...props}
  />
)
