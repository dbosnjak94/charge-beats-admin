/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

// Create different synth types with unique characteristics
const createSynth = (type = 'default') => {
  switch (type) {
    case 'bass':
      return new Tone.MonoSynth({
        oscillator: {
          type: 'square',
        },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.8,
          release: 0.4,
        },
        filterEnvelope: {
          attack: 0.05,
          decay: 0.5,
          sustain: 0.1,
          release: 2,
          baseFrequency: 200,
          octaves: 2.6,
        },
      }).toDestination()

    case 'lead':
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'sine',
        },
        envelope: {
          attack: 0.02,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8,
        },
      }).toDestination()

    case 'pluck':
      return new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.98,
      }).toDestination()

    default:
      return new Tone.Synth({
        oscillator: {
          type: 'triangle',
        },
        envelope: {
          attack: 0.05,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination()
  }
}

// Base SynthButton component
const SynthButton = ({ pattern, label, className, type = 'default' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const synthRef = useRef(null)
  const sequenceRef = useRef(null)

  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
      }
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!synthRef.current) {
      synthRef.current = createSynth(type)
    }

    if (!sequenceRef.current) {
      sequenceRef.current = new Tone.Sequence(
        (time, note) => {
          if (note !== null) {
            synthRef.current.triggerAttackRelease(
              note.pitch,
              note.duration,
              time,
              note.velocity
            )
          }
        },
        pattern,
        '8n'
      )
    }
  }

  const togglePlay = async () => {
    await initializeAudio()

    if (!isPlaying) {
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start()
      }
      Tone.Transport.bpm.value = 128
      sequenceRef.current.start(0)
    } else {
      sequenceRef.current.stop()
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? `Stop ${label}` : `Play ${label}`}
    </Button>
  )
}

// Export individual synth patterns
export const RetroBassSynthButton = (props) => (
  <SynthButton
    pattern={[
      { pitch: 'C2', duration: '8n', velocity: 0.8 },
      { pitch: 'C2', duration: '8n', velocity: 0.6 },
      { pitch: 'G2', duration: '8n', velocity: 0.8 },
      { pitch: 'C2', duration: '8n', velocity: 0.6 },
    ]}
    type='bass'
    label='Retro Bass'
    {...props}
  />
)

export const PluckMelodyButton = (props) => (
  <SynthButton
    pattern={[
      { pitch: 'E4', duration: '8n', velocity: 0.7 },
      { pitch: 'G4', duration: '8n', velocity: 0.7 },
      { pitch: 'A4', duration: '8n', velocity: 0.8 },
      { pitch: 'G4', duration: '8n', velocity: 0.7 },
    ]}
    type='pluck'
    label='Pluck Melody'
    {...props}
  />
)

export const FunkyLeadButton = (props) => (
  <SynthButton
    pattern={[
      { pitch: 'C3', duration: '16n', velocity: 0.8 },
      { pitch: 'E3', duration: '16n', velocity: 0.8 },
      { pitch: 'G3', duration: '16n', velocity: 0.8 },
      { pitch: 'A3', duration: '8n', velocity: 0.9 },
    ]}
    type='lead'
    label='Funky Lead'
    {...props}
  />
)

export const PulseSynthButton = (props) => (
  <SynthButton
    pattern={[
      { pitch: 'C4', duration: '8n', velocity: 0.7 },
      { pitch: 'C4', duration: '8n', velocity: 0.7 },
      { pitch: 'C4', duration: '8n', velocity: 0.8 },
      { pitch: 'C4', duration: '8n', velocity: 0.7 },
    ]}
    type='default'
    label='Pulse Synth'
    {...props}
  />
)
