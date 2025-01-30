/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createAcidLead = () => {
  // Create an acid-style monosynth
  const acidSynth = new Tone.MonoSynth({
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.3,
      release: 0.1,
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0.3,
      release: 0.2,
      baseFrequency: 200,
      octaves: 4,
      exponent: 2,
    },
  })

  // Create filter with high resonance for acid sound
  const filter = new Tone.Filter({
    frequency: 2000,
    type: 'lowpass',
    rolloff: -24,
    Q: 8,
  })

  // Create distortion for grit
  const distortion = new Tone.Distortion({
    distortion: 0.4,
    wet: 0.2,
  })

  // Create delay for space
  const delay = new Tone.PingPongDelay({
    delayTime: '8n',
    feedback: 0.3,
    wet: 0.15,
  })

  // Create LFO for filter modulation
  const filterLfo = new Tone.LFO({
    frequency: '8n',
    min: 400,
    max: 4000,
  }).start()

  // Connect everything
  filterLfo.connect(filter.frequency)
  acidSynth.chain(filter, distortion, delay, Tone.Destination)

  return { acidSynth, filterLfo }
}

const AcidLeadButton = (props) => {
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
        synthRef.current.acidSynth.dispose()
        synthRef.current.filterLfo.dispose()
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!synthRef.current) {
      synthRef.current = createAcidLead()
    }

    if (!sequenceRef.current) {
      // D minor acid pattern
      const acidPattern = [
        { time: '0:0', note: 'D4', duration: '16n' },
        { time: '0:1', note: 'F4', duration: '16n' },
        { time: '0:2', note: 'A4', duration: '8n' },
        { time: '0:3', note: 'D4', duration: '16n' },
        { time: '1:0', note: 'C4', duration: '16n' },
        { time: '1:1', note: 'D4', duration: '16n' },
        { time: '1:2', note: 'F4', duration: '8n' },
        { time: '1:3', note: 'E4', duration: '16n' },
        { time: '2:0', note: 'D4', duration: '16n' },
        { time: '2:1', note: 'A3', duration: '16n' },
        { time: '2:2', note: 'D4', duration: '8n' },
        { time: '2:3', note: 'F4', duration: '16n' },
        { time: '3:0', note: 'A4', duration: '16n' },
        { time: '3:1', note: 'G4', duration: '16n' },
        { time: '3:2', note: 'F4', duration: '8n' },
        { time: '3:3', note: 'D4', duration: '16n' },
      ]

      sequenceRef.current = new Tone.Part((time, value) => {
        synthRef.current.acidSynth.triggerAttackRelease(
          value.note,
          value.duration,
          time
        )
      }, acidPattern).start(0)

      // Loop the pattern
      sequenceRef.current.loop = true
      sequenceRef.current.loopEnd = '4:0'
    }
  }

  const togglePlay = async () => {
    await initializeAudio()

    if (!isPlaying) {
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start()
      }
      Tone.Transport.bpm.value = 128 // Set to specified 128 BPM
    } else {
      sequenceRef.current.stop()
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      onClick={togglePlay}
      className={`${props.className} ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {isPlaying ? 'Stop Acid Lead' : 'Play Acid Lead'}
    </Button>
  )
}

export default AcidLeadButton
