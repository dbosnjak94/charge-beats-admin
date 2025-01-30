/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createAngryRobotBass = () => {
  // Create an FM synth for robotic character
  const fmSynth = new Tone.FMSynth({
    harmonicity: 3.01, // Slightly detuned for robot character
    modulationIndex: 10,
    oscillator: {
      type: 'square', // Sharp, digital sound
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.8,
      release: 0.2,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.2,
      release: 0.1,
    },
  })

  // Add sub-bass layer using additional synth
  const subSynth = new Tone.MonoSynth({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.02,
      decay: 0.2,
      sustain: 0.9,
      release: 0.3,
    },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.5,
      sustain: 0.7,
      release: 0.2,
      baseFrequency: 50,
      octaves: 2,
    },
  })

  // Effects chain for aggressive character
  const crusher = new Tone.BitCrusher(6) // Add digital artifacts
  const filter = new Tone.Filter({
    frequency: 800,
    type: 'lowpass',
    rolloff: -24,
  })
  const distortion = new Tone.Distortion({
    distortion: 0.4,
    wet: 0.3,
  })
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 6,
    attack: 0.02,
    release: 0.2,
  })

  // Connect everything
  fmSynth.chain(crusher, filter, distortion, compressor, Tone.Destination)
  subSynth.chain(filter, compressor, Tone.Destination)

  // Adjust volumes
  fmSynth.volume.value = -6
  subSynth.volume.value = -12

  return { fmSynth, subSynth }
}

export const AngryRobotBassButton = (props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const synthsRef = useRef(null)
  const sequencesRef = useRef(null)

  useEffect(() => {
    return () => {
      if (sequencesRef.current) {
        Object.values(sequencesRef.current).forEach((seq) => {
          seq.stop()
          seq.dispose()
        })
      }
      if (synthsRef.current) {
        Object.values(synthsRef.current).forEach((synth) => {
          synth.dispose()
        })
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!synthsRef.current) {
      synthsRef.current = createAngryRobotBass()
    }

    if (!sequencesRef.current) {
      // Create an aggressive robotic pattern
      const mainPattern = [
        { pitch: 'C2', duration: '8n', velocity: 0.9 },
        { pitch: 'C2', duration: '16n', velocity: 0.7 },
        null,
        { pitch: 'G1', duration: '8n', velocity: 0.9 },
        { pitch: 'C2', duration: '8n', velocity: 0.8 },
        null,
        { pitch: 'E1', duration: '8n', velocity: 0.9 },
        { pitch: 'C2', duration: '16n', velocity: 0.7 },
      ]

      // Sub bass follows a simpler pattern
      const subPattern = [
        { pitch: 'C1', duration: '4n', velocity: 0.7 },
        null,
        { pitch: 'G0', duration: '4n', velocity: 0.7 },
        null,
      ]

      sequencesRef.current = {
        main: new Tone.Sequence(
          (time, note) => {
            if (note !== null) {
              synthsRef.current.fmSynth.triggerAttackRelease(
                note.pitch,
                note.duration,
                time,
                note.velocity
              )
            }
          },
          mainPattern,
          '8n'
        ),
        sub: new Tone.Sequence(
          (time, note) => {
            if (note !== null) {
              synthsRef.current.subSynth.triggerAttackRelease(
                note.pitch,
                note.duration,
                time,
                note.velocity
              )
            }
          },
          subPattern,
          '4n'
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
      Tone.Transport.bpm.value = 174 // Set to specified 174 BPM
      Object.values(sequencesRef.current).forEach((seq) => seq.start(0))
    } else {
      Object.values(sequencesRef.current).forEach((seq) => seq.stop())
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${props.className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? 'Stop Angry Robot Bass' : 'Play Angry Robot Bass'}
    </Button>
  )
}
