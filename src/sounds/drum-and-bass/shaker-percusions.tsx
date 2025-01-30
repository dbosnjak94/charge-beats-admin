/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from '@/components/ui/button'

const createShakerSound = () => {
  // Create a noise generator for the shaker
  const shaker = new Tone.NoiseSynth({
    noise: {
      type: 'white',
      playbackRate: 2,
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.05,
    },
  })

  // Create a filter to shape the noise into a shaker-like sound
  const shakerFilter = new Tone.Filter({
    type: 'bandpass',
    frequency: 4000,
    Q: 1.5,
  })

  // Add subtle reverb for space
  const reverb = new Tone.Reverb({
    decay: 0.5,
    wet: 0.1,
  }).toDestination()

  // Create a volume node for level control
  const volume = new Tone.Volume(-12)

  // Connect the chain
  shaker.chain(shakerFilter, volume, reverb, Tone.Destination)

  return shaker
}

const ShakerButton = (props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const shakerRef = useRef(null)
  const sequenceRef = useRef(null)

  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.stop()
        sequenceRef.current.dispose()
      }
      if (shakerRef.current) {
        shakerRef.current.dispose()
      }
    }
  }, [])

  const initializeAudio = async () => {
    await Tone.start()

    if (!shakerRef.current) {
      shakerRef.current = createShakerSound()
    }

    if (!sequenceRef.current) {
      // Create an intermittent (on/off) pattern
      // 1 = full velocity, 0.6 = medium velocity, null = off
      const shakerPattern = [
        // ON section
        [0.8, 0.4, 0.8, 0.4, 0.8, 0.4, 0.8, 0.4],
        // OFF section
        [null, null, null, null, null, null, null, null],
        // ON section with variation
        [0.8, 0.4, null, 0.4, 0.8, 0.4, null, 0.4],
        // OFF section
        [null, null, null, null, null, null, null, null],
      ].flat() // Flatten the array for the sequence

      sequenceRef.current = new Tone.Sequence(
        (time, velocity) => {
          if (velocity !== null) {
            shakerRef.current.triggerAttackRelease('32n', time, velocity)
          }
        },
        shakerPattern,
        '16n'
      )
    }
  }

  const togglePlay = async () => {
    await initializeAudio()

    if (!isPlaying) {
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start()
      }
      Tone.Transport.bpm.value = 172 // Set to specified 172 BPM
      sequenceRef.current.start(0)
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
      {isPlaying ? 'Stop Shaker' : 'Play Shaker'}
    </Button>
  )
}

export default ShakerButton
