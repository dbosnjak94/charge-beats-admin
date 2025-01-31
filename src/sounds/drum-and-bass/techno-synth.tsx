// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import React, { useState, useRef, useEffect } from "react"
// import * as Tone from "tone"
// import { Button } from "@/components/ui/button"

// const createTechnoSynth = () => {
//   // Create main synth
//   const mainSynth = new Tone.PolySynth(Tone.Synth, {
//     oscillator: {
//       type: "sawtooth",
//     },
//     envelope: {
//       attack: 0.02,
//       decay: 0.3,
//       sustain: 0.4,
//       release: 0.8,
//     },
//   })

//   // Create filter for synth
//   const filter = new Tone.AutoFilter({
//     frequency: 0.5,
//     depth: 0.5,
//     baseFrequency: 200,
//     octaves: 4,
//   }).start()

//   // Create delay for space
//   const delay = new Tone.PingPongDelay({
//     delayTime: "8n",
//     feedback: 0.2,
//     wet: 0.1,
//   })

//   // Add chorus for width
//   const chorus = new Tone.Chorus({
//     frequency: 0.5,
//     delayTime: 3.5,
//     depth: 0.7,
//     wet: 0.3,
//   }).start()

//   // Chain effects
//   mainSynth.chain(filter, chorus, delay, Tone.Destination)

//   // Create an LFO for filter modulation
//   const lfo = new Tone.LFO({
//     frequency: "8n",
//     min: 400,
//     max: 4000,
//   })
//     .connect(filter.frequency)
//     .start()

//   return { mainSynth, filter, lfo }
// }

// const TechnoSynthButton = (props) => {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const synthRef = useRef(null)
//   const sequenceRef = useRef(null)

//   useEffect(() => {
//     return () => {
//       if (sequenceRef.current) {
//         sequenceRef.current.stop()
//         sequenceRef.current.dispose()
//       }
//       if (synthRef.current) {
//         synthRef.current.mainSynth.dispose()
//         synthRef.current.filter.dispose()
//         synthRef.current.lfo.dispose()
//       }
//     }
//   }, [])

//   const initializeAudio = async () => {
//     await Tone.start()

//     if (!synthRef.current) {
//       synthRef.current = createTechnoSynth()
//     }

//     if (!sequenceRef.current) {
//       // Create a techno pattern in F minor
//       const pattern = [
//         // F minor chord progression with techno rhythm
//         {
//           time: "0:0",
//           note: ["F3", "Ab3", "C4"],
//           duration: "8n",
//           velocity: 0.7,
//         },
//         { time: "0:1", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
//         {
//           time: "0:2",
//           note: ["Eb3", "G3", "Bb3"],
//           duration: "8n",
//           velocity: 0.7,
//         },
//         { time: "0:3", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
//         // Second bar
//         {
//           time: "1:0",
//           note: ["Db3", "F3", "Ab3"],
//           duration: "8n",
//           velocity: 0.7,
//         },
//         { time: "1:1", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
//         {
//           time: "1:2",
//           note: ["C3", "Eb3", "G3"],
//           duration: "8n",
//           velocity: 0.7,
//         },
//         { time: "1:3", note: ["F3", "Ab3"], duration: "16n", velocity: 0.5 },
//       ]

//       sequenceRef.current = new Tone.Part((time, value) => {
//         synthRef.current.mainSynth.triggerAttackRelease(value.note, value.duration, time, value.velocity)
//       }, pattern).start(0)

//       // Loop the pattern
//       sequenceRef.current.loop = true
//       sequenceRef.current.loopEnd = "2:0"
//     }
//   }

//   export const togglePlayButton = async () => {
//     await initializeAudio()

//     if (!isPlaying) {
//       if (Tone.Transport.state !== "started") {
//         Tone.Transport.start()
//       }
//       Tone.Transport.bpm.value = 170 // Set to specified 170 BPM
//     } else {
//       sequenceRef.current.stop()
//     }

//     setIsPlaying(!isPlaying)
//   }

//   return (
//     <Button onClick={togglePlay} className={`${props.className} ${isPlaying ? "bg-red-500 hover:bg-red-600" : ""}`}>
//       {isPlaying ? "Stop Techno Synth" : "Play Techno Synth"}
//     </Button>
//   )
// }

// export default TechnoSynthButton

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef, useEffect } from "react"
import * as Tone from "tone"
import { Button } from "@/components/ui/button"

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

  return { mainSynth, filter, lfo }
}

export const toggleTechnoSynth = async (isPlaying, setIsPlaying, synthRef, sequenceRef) => {
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
  }

  if (!isPlaying) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start()
    }
    Tone.Transport.bpm.value = 170
  } else {
    sequenceRef.current.stop()
  }

  setIsPlaying(!isPlaying)
}

const TechnoSynthButton = (props) => {
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
        synthRef.current.mainSynth.dispose()
        synthRef.current.filter.dispose()
        synthRef.current.lfo.dispose()
      }
    }
  }, [])

  return (
    <Button
      onClick={() => toggleTechnoSynth(isPlaying, setIsPlaying, synthRef, sequenceRef)}
      className={`${props.className} ${isPlaying ? "bg-red-500 hover:bg-red-600" : ""}`}
    >
      {isPlaying ? "Stop Techno Synth" : "Play Techno Synth"}
    </Button>
  )
}

export default TechnoSynthButton
