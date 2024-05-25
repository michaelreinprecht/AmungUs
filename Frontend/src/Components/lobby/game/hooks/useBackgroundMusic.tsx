import { useEffect } from 'react';

export const useBackgroundMusic = (src: string) => {
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let audioBuffer: AudioBuffer | null = null;

    const fetchAndDecodeAudio = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        playAudio();
      } catch (error) {
        console.error('Error fetching or decoding audio data:', error);
      }
    };

    const playAudio = () => {
      if (audioBuffer) {
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.loop = true;
        sourceNode.connect(audioContext.destination);
        sourceNode.start(0);
      }
    };

    fetchAndDecodeAudio();

    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [src]);
};
