/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createSoulKeys = () => {
  // Create a warm electric piano sound
  const keys = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'triangle',
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.4,
      release: 0.8,
    },
  })

  // Very subtle chorus for warmth (keeping it dry)
  const chorus = new Tone.Chorus({
    frequency: 1.5,
    delayTime: 3.5,
    depth: 0.3,
    wet: 0.1,
  }).start()

  // Subtle compression just to even out dynamics
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.05,
    release: 0.2,
  })

  // Keep the chain minimal for dry sound
  keys.chain(chorus, compressor, Tone.Destination)

  // Set initial volume
  keys.volume.value = -6

  return keys
}

const SoulKeysButton = (props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const keysRef = useRef(null)
  const sequenceRef = useRef(null)

  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
      }
      if (keysRef.current) {
        keysRef.current.dispose()
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!keysRef.current) {
      keysRef.current = createSoulKeys()
    }

    if (!sequenceRef.current) {
      // Create a soulful F minor progression with melting characteristics
      const pattern = [
        // Bar 1: Fm9 with melting notes
        {
          time: '0:0',
          notes: ['F3', 'Ab3', 'C4', 'Eb4', 'G4'],
          duration: '2n',
          velocity: 0.7,
        },
        {
          time: '0:2',
          notes: ['F3', 'Ab3', 'C4', 'Eb4'],
          duration: '4n',
          velocity: 0.6,
        },
        {
          time: '0:3',
          notes: ['F3', 'Ab3', 'C4'],
          duration: '4n',
          velocity: 0.5,
        },

        // Bar 2: Ab13 melting down
        {
          time: '1:0',
          notes: ['Ab3', 'C4', 'Eb4', 'G4', 'F5'],
          duration: '2n',
          velocity: 0.7,
        },
        {
          time: '1:2',
          notes: ['Ab3', 'C4', 'Eb4', 'G4'],
          duration: '4n',
          velocity: 0.6,
        },
        {
          time: '1:3',
          notes: ['Ab3', 'C4', 'Eb4'],
          duration: '4n',
          velocity: 0.5,
        },

        // Bar 3: Db9 flowing up
        {
          time: '2:0',
          notes: ['Db3', 'F3', 'Ab3', 'C4', 'Eb4'],
          duration: '2n',
          velocity: 0.7,
        },
        {
          time: '2:2',
          notes: ['Db3', 'F3', 'Ab3', 'C4'],
          duration: '4n',
          velocity: 0.6,
        },
        {
          time: '2:3',
          notes: ['F3', 'Ab3', 'C4', 'Eb4'],
          duration: '4n',
          velocity: 0.7,
        },

        // Bar 4: C7alt resolving back to Fm
        {
          time: '3:0',
          notes: ['C3', 'E3', 'Bb3', 'Db4'],
          duration: '2n',
          velocity: 0.7,
        },
        {
          time: '3:2',
          notes: ['C3', 'E3', 'Bb3'],
          duration: '4n',
          velocity: 0.6,
        },
        {
          time: '3:3',
          notes: ['C3', 'G3', 'Bb3'],
          duration: '4n',
          velocity: 0.5,
        },
      ]

      sequenceRef.current = new Tone.Part((time, value) => {
        keysRef.current.triggerAttackRelease(
          value.notes,
          value.duration,
          time,
          value.velocity
        )
      }, pattern).start(0)

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
      Tone.Transport.bpm.value = 110 // Set to specified 110 BPM
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
      {isPlaying ? 'Stop Soul Keys' : 'Play Soul Keys'}
    </Button>
  )
}

export default SoulKeysButton
