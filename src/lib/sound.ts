let ctx: AudioContext | null = null;

export function playPageTurn() {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const dur = 0.32;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      const env = Math.pow(Math.sin(Math.PI * t), 1.6) * (1 - t * 0.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2400, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + dur);
    bp.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.07;
    src.connect(bp).connect(gain).connect(ctx.destination);
    src.start();
  } catch {
    /* audio unavailable */
  }
}

export const SOUND_KEY = "knotline-sound";
