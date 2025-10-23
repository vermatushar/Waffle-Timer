// Sound utility functions for button clicks and other effects

export const playClickSound = () => {
  try {
    // Create a bubble pop sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple oscillators for bubble effect
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Connect nodes
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure filter for bubble-like sound
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, audioContext.currentTime);
    filter.Q.setValueAtTime(2, audioContext.currentTime);
    
    // Create bubble frequencies
    oscillator1.frequency.setValueAtTime(400, audioContext.currentTime); // Low bubble
    oscillator1.type = 'sine';
    
    oscillator2.frequency.setValueAtTime(800, audioContext.currentTime); // Higher pop
    oscillator2.type = 'sine';
    
    // Quick bubble pop envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    
    // Play the bubble sound
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.08);
    oscillator2.stop(audioContext.currentTime + 0.08);
  } catch (error) {
    // Fallback: silent if Web Audio API is not available
    console.log('Bubble click sound not available');
  }
};

export const playDuckHoverSound = () => {
  try {
    // Create a cute sigh sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple oscillators for sigh effect
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Connect nodes
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure filter for a soft, breathy sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, audioContext.currentTime);
    
    // Create sigh frequencies (descending)
    oscillator1.frequency.setValueAtTime(150, audioContext.currentTime); // Start low
    oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.8); // Descend
    oscillator1.type = 'sine';
    
    oscillator2.frequency.setValueAtTime(220, audioContext.currentTime); // Higher harmonic
    oscillator2.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.8); // Descend
    oscillator2.type = 'sine';
    
    // Set volume envelope (sigh pattern: quick rise, slow fall)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    
    // Play the sigh sound
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.8);
    oscillator2.stop(audioContext.currentTime + 0.8);
  } catch (error) {
    console.log('Duck sigh sound not available');
  }
};
