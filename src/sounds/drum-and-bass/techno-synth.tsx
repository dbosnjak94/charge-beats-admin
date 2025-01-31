/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as Tone from "tone"
import { registerSynth, registerSequence } from "@/sounds/music-manager"

export const createTechnoSynth = () => {
  const mainSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 },
  })

  const filter = new Tone.AutoFilter({
    frequency: 0.5,
    depth: 0.5,
    baseFrequency: 200,
    octaves: 4,
  }).start()

  const delay = new Tone.PingPongDelay({ delayTime: "8n", feedback: 0.2, wet: 0.1 })
  const chorus = new Tone.Chorus({ frequency: 0.5, delayTime: 3.5, depth: 0.7, wet: 0.3 }).start()

  mainSynth.chain(filter, chorus, delay, Tone.Destination)

  const lfo = new Tone.LFO({ frequency: "8n", min: 400, max: 4000 }).connect(filter.frequency).start()

  registerSynth(mainSynth)
  registerSynth(filter)
  registerSynth(lfo)

  return { mainSynth, filter, lfo }
}

export const toggleTechnoSynth = async (isPlayingRef, setIsPlaying, synthRef, sequenceRef) => {
  await Tone.start()

  if (!synthRef.current) {
    synthRef.current = createTechnoSynth()
  }

  if (!sequenceRef.current) {
    const pattern = [
      { time: "0:0", note: ["F3", "Ab3", "C4"], duration: "8n", velocity: 0.7 },
      { time: "0:1", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
      { time: "0:2", note: ["Eb3", "G3", "Bb3"], duration: "8n", velocity: 0.7 },
      { time: "0:3", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
      { time: "1:0", note: ["Db3", "F3", "Ab3"], duration: "8n", velocity: 0.7 },
      { time: "1:1", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
      { time: "1:2", note: ["C3", "Eb3", "G3"], duration: "8n", velocity: 0.7 },
      { time: "1:3", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
    ]

    sequenceRef.current = new Tone.Part((time, value) => {
      synthRef.current.mainSynth.triggerAttackRelease(value.note, value.duration, time, value.velocity)
    }, pattern).start(0)

    sequenceRef.current.loop = true
    sequenceRef.current.loopEnd = "2:0"

    registerSequence(sequenceRef.current)
  }

  if (!isPlayingRef.current) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start()
    }
    Tone.Transport.bpm.value = 170
    sequenceRef.current.start(0)
  } else {
    sequenceRef.current.stop()
  }

  isPlayingRef.current = !isPlayingRef.current
  setIsPlaying(isPlayingRef.current)
}
