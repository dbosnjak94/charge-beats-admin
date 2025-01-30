/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createAcidBass = () => {
  // Create acid bass synth
  const acidBass = new Tone.MonoSynth({
    oscillator: {
      type: 'sawtooth',
    },
    envelope: {
      attack: 0.003,
      decay: 0.1,
      sustain: 0.6,
      release: 0.2,
    },
    filterEnvelope: {
      attack: 0.02,
      decay: 0.5,
      sustain: 0.2,
      release: 0.3,
      baseFrequency: 100,
      octaves: 5,
      exponent: 2,
    },
  })

  // Create filter with high resonance
  const filter = new Tone.Filter({
    frequency: 800,
    type: 'lowpass',
    rolloff: -24,
    Q: 12, // High resonance for acid squelch
  })

  // Create auto-filter for fading effect
  const autoFilter = new Tone.AutoFilter({
    frequency: '8n.',
    baseFrequency: 200,
    octaves: 3.5,
    depth: 0.7,
  }).start()

  // Create waveshaper for subtle drive
  const waveshaper = new Tone.Chebyshev(3)

  // Create compressor to control dynamics
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 4,
    attack: 0.04,
    release: 0.2,
  })

  // Create slow LFO for filter sweeps
  const filterLfo = new Tone.LFO({
    frequency: '2n',
    min: 200,
    max: 2000,
  }).start()

  // Connect filter modulation
  filterLfo.connect(filter.frequency)

  // Connect everything in chain
  acidBass.chain(filter, autoFilter, waveshaper, compressor, Tone.Destination)

  return { acidBass, filterLfo }
}

const AcidBassButton = (props) => {
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
        synthRef.current.acidBass.dispose()
        synthRef.current.filterLfo.dispose()
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!synthRef.current) {
      synthRef.current = createAcidBass()
    }

    if (!sequenceRef.current) {
      // Create acid bass pattern in E
      const bassPattern = [
        // Bar 1: Basic pattern
        { time: '0:0', note: 'E1', duration: '8n' },
        { time: '0:1', note: 'E1', duration: '16n' },
        { time: '0:2', note: 'E2', duration: '8n' },
        { time: '0:3', note: 'E1', duration: '16n' },
        // Bar 2: Variation with slides
        { time: '1:0', note: 'E1', duration: '8n' },
        { time: '1:1', note: 'G1', duration: '16n' },
        { time: '1:2', note: 'B1', duration: '8n' },
        { time: '1:3', note: 'E1', duration: '16n' },
        // Bar 3: More movement
        { time: '2:0', note: 'A1', duration: '8n' },
        { time: '2:1', note: 'E1', duration: '16n' },
        { time: '2:2', note: 'G1', duration: '8n' },
        { time: '2:3', note: 'E1', duration: '16n' },
        // Bar 4: Return to root
        { time: '3:0', note: 'E1', duration: '8n' },
        { time: '3:1', note: 'B1', duration: '16n' },
        { time: '3:2', note: 'E2', duration: '8n' },
        { time: '3:3', note: 'E1', duration: '16n' },
      ]

      sequenceRef.current = new Tone.Part((time, value) => {
        synthRef.current.acidBass.triggerAttackRelease(
          value.note,
          value.duration,
          time
        )
      }, bassPattern).start(0)

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
      {isPlaying ? 'Stop Acid Bass' : 'Play Acid Bass'}
    </Button>
  )
}

export default AcidBassButton
