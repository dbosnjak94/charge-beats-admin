/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as Tone from "tone"
import { registerSynth, registerSequence } from "@/sounds/music-manager"

export const createAcidLead = () => {
  const acidSynth = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.1 },
    filterEnvelope: { attack: 0.001, decay: 0.3, sustain: 0.3, release: 0.2, baseFrequency: 200, octaves: 4, exponent: 2 },
  })

  const filter = new Tone.Filter({ frequency: 2000, type: "lowpass", rolloff: -24, Q: 8 })
  const distortion = new Tone.Distortion({ distortion: 0.4, wet: 0.2 })
  const delay = new Tone.PingPongDelay({ delayTime: "8n", feedback: 0.3, wet: 0.15 })
  const filterLfo = new Tone.LFO({ frequency: "8n", min: 400, max: 4000 }).start()

  filterLfo.connect(filter.frequency)
  acidSynth.chain(filter, distortion, delay, Tone.Destination)

  registerSynth(acidSynth)
  registerSynth(filterLfo)

  return { acidSynth, filterLfo }
}

export const toggleAcidLead = async (isPlayingRef, setIsPlaying, synthRef, sequenceRef) => {
  await Tone.start()

  if (!synthRef.current) {
    synthRef.current = createAcidLead()
  }

  if (!sequenceRef.current) {
    const acidPattern = [
      { time: "0:0", note: "D4", duration: "16n" },
      { time: "0:1", note: "F4", duration: "16n" },
      { time: "0:2", note: "A4", duration: "8n" },
      { time: "0:3", note: "D4", duration: "16n" },
      { time: "1:0", note: "C4", duration: "16n" },
      { time: "1:1", note: "D4", duration: "16n" },
      { time: "1:2", note: "F4", duration: "8n" },
      { time: "1:3", note: "E4", duration: "16n" },
      { time: "2:0", note: "D4", duration: "16n" },
      { time: "2:1", note: "A3", duration: "16n" },
      { time: "2:2", note: "D4", duration: "8n" },
      { time: "2:3", note: "F4", duration: "16n" },
      { time: "3:0", note: "A4", duration: "16n" },
      { time: "3:1", note: "G4", duration: "16n" },
      { time: "3:2", note: "F4", duration: "8n" },
      { time: "3:3", note: "D4", duration: "16n" },
    ]

    sequenceRef.current = new Tone.Part((time, value) => {
      synthRef.current.acidSynth.triggerAttackRelease(value.note, value.duration, time)
    }, acidPattern).start(0)

    sequenceRef.current.loop = true
    sequenceRef.current.loopEnd = "4:0"

    registerSequence(sequenceRef.current)
  }

  if (!isPlayingRef.current) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start()
    }
    Tone.Transport.bpm.value = 128
  } else {
    sequenceRef.current.stop()
  }

  isPlayingRef.current = !isPlayingRef.current
  setIsPlaying(isPlayingRef.current)
}
