/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as Tone from "tone"
import { registerSynth, registerSequence } from "@/sounds/music-manager"

export const createAcidBass = () => {
  const acidBass = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.003, decay: 0.1, sustain: 0.6, release: 0.2 },
    filterEnvelope: { attack: 0.02, decay: 0.5, sustain: 0.2, release: 0.3, baseFrequency: 100, octaves: 5, exponent: 2 },
  })

  const filter = new Tone.Filter({ frequency: 800, type: "lowpass", rolloff: -24, Q: 12 })
  const autoFilter = new Tone.AutoFilter({ frequency: "8n.", baseFrequency: 200, octaves: 3.5, depth: 0.7 }).start()
  const waveshaper = new Tone.Chebyshev(3)
  const compressor = new Tone.Compressor({ threshold: -20, ratio: 4, attack: 0.04, release: 0.2 })
  const filterLfo = new Tone.LFO({ frequency: "2n", min: 200, max: 2000 }).start()

  filterLfo.connect(filter.frequency)
  acidBass.chain(filter, autoFilter, waveshaper, compressor, Tone.Destination)

  registerSynth(acidBass)
  registerSynth(filterLfo)

  return { acidBass, filterLfo }
}

export const toggleAcidBass = async (isPlayingRef, setIsPlaying, synthRef, sequenceRef) => {
  await Tone.start()

  if (!synthRef.current) {
    synthRef.current = createAcidBass()
  }

  if (!sequenceRef.current) {
    const bassPattern = [
      { time: "0:0", note: "E1", duration: "8n" },
      { time: "0:1", note: "E1", duration: "16n" },
      { time: "0:2", note: "E2", duration: "8n" },
      { time: "0:3", note: "E1", duration: "16n" },
      { time: "1:0", note: "E1", duration: "8n" },
      { time: "1:1", note: "G1", duration: "16n" },
      { time: "1:2", note: "B1", duration: "8n" },
      { time: "1:3", note: "E1", duration: "16n" },
      { time: "2:0", note: "A1", duration: "8n" },
      { time: "2:1", note: "E1", duration: "16n" },
      { time: "2:2", note: "G1", duration: "8n" },
      { time: "2:3", note: "E1", duration: "16n" },
      { time: "3:0", note: "E1", duration: "8n" },
      { time: "3:1", note: "B1", duration: "16n" },
      { time: "3:2", note: "E2", duration: "8n" },
      { time: "3:3", note: "E1", duration: "16n" },
    ]

    sequenceRef.current = new Tone.Part((time, value) => {
      synthRef.current.acidBass.triggerAttackRelease(value.note, value.duration, time)
    }, bassPattern).start(0)

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
