// musicManager.js
import * as Tone from "tone"

const activeSynths = new Set()
const activeSequences = new Set()

export const registerSynth = (synth) => {
  activeSynths.add(synth)
}

export const registerSequence = (sequence) => {
  activeSequences.add(sequence)
}

export const stopAllMusic = () => {
  activeSequences.forEach((seq) => {
    seq.stop()
    seq.dispose()
  })
  activeSequences.clear()

  activeSynths.forEach((synth) => {
    synth.dispose()
  })
  activeSynths.clear()

  if (Tone.Transport.state === "started") {
    Tone.Transport.stop()
  }
}
