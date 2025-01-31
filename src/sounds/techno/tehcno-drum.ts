/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as Tone from "tone"
import { registerSynth, registerSequence } from "@/sounds/music-manager"

export const createTechnoDrumKit = () => {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 7,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.4 },
  })

  const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 1000,
    octaves: 1.5,
  })

  const clap = new Tone.NoiseSynth({
    noise: { type: "pink", playbackRate: 3 },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
  })

  const rim = new Tone.MetalSynth({
    frequency: 800,
    envelope: { attack: 0.001, decay: 0.05, release: 0.05 },
    harmonicity: 3.1,
    modulationIndex: 16,
    resonance: 4000,
    octaves: 1,
  })

  const effectsChannel = new Tone.Channel({ volume: -12, pan: 0 }).toDestination()
  kick.toDestination()
  hihat.connect(effectsChannel)
  clap.connect(effectsChannel)
  rim.connect(effectsChannel)

  registerSynth(kick)
  registerSynth(hihat)
  registerSynth(clap)
  registerSynth(rim)

  return { kick, hihat, clap, rim }
}

export const toggleTechnoDrums = async (isPlayingRef, setIsPlaying, instrumentsRef, patternsRef) => {
  await Tone.start()

  if (!instrumentsRef.current) {
    instrumentsRef.current = createTechnoDrumKit()
  }

  if (!patternsRef.current) {
    patternsRef.current = {
      kick: new Tone.Pattern(
        (time) => {
          instrumentsRef.current.kick.triggerAttackRelease("C1", "8n", time, 1)
        },
        [1, null, 1, null, 1, null, 1, null],
        "8n"
      ),

      hihat: new Tone.Pattern(
        (time, velocity) => {
          if (velocity) {
            instrumentsRef.current.hihat.triggerAttackRelease("32n", time, velocity * 0.5)
          }
        },
        [0.8, 0.4, 0.8, 0.4, 0.8, 0.4, 0.8, 0.4],
        "16n"
      ),

      clap: new Tone.Pattern(
        (time) => {
          instrumentsRef.current.clap.triggerAttackRelease("16n", time)
        },
        [null, null, 1, null, null, null, 1, null],
        "8n"
      ),

      rim: new Tone.Pattern(
        (time) => {
          instrumentsRef.current.rim.triggerAttackRelease("C5", "16n", time, 0.3)
        },
        [null, null, null, 1, null, null, null, 1],
        "8n"
      ),
    }

    Object.values(patternsRef.current).forEach(registerSequence)
  }

  if (!isPlayingRef.current) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start()
    }
    Tone.Transport.bpm.value = 128
    Object.values(patternsRef.current).forEach((pattern) => pattern.start(0))
  } else {
    Object.values(patternsRef.current).forEach((pattern) => pattern.stop())
  }

  isPlayingRef.current = !isPlayingRef.current
  setIsPlaying(isPlayingRef.current)
}
