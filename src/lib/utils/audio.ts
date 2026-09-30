/**
 * Synthesizes a gentle, premium 2-tone chime using Web Audio API.
 * Works natively in all modern browsers without loading external MP3 files.
 */
export function playNotificationChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Note 1: F5 (698.46 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(698.46, ctx.currentTime);
    
    gain1.gain.setValueAtTime(0.001, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Note 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12);
    
    gain2.gain.setValueAtTime(0.001, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn("Audio chime playback notice:", e);
  }
}

/**
 * Synthesizes a subtle high-tech tick sound on button hover.
 */
export function playHoverTickSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

/**
 * Synthesizes an epic cinematic launch sonic boom with rising frequency sweep,
 * sub-bass impact, and crystalline harmonic shimmer.
 */
export function playLaunchIgnitionSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // 1. Sub-bass impact & riser
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(55, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.8);
    subOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.8);
    
    subGain.gain.setValueAtTime(0.01, ctx.currentTime);
    subGain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(ctx.currentTime);
    subOsc.stop(ctx.currentTime + 2.3);

    // 2. High Shimmer Harmonic (Metamorphic crystal resonance)
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = "sawtooth";
    shimmerOsc.frequency.setValueAtTime(440, ctx.currentTime);
    shimmerOsc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.9);
    
    shimmerGain.gain.setValueAtTime(0.01, ctx.currentTime);
    shimmerGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(ctx.currentTime);
    shimmerOsc.stop(ctx.currentTime + 1.7);
  } catch (e) {
    console.warn("Launch audio notice:", e);
  }
}
