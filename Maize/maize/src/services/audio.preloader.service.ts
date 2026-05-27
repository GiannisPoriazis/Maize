import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioPreloaderService {

  private audioFiles: Map<string, HTMLAudioElement> = new Map();

  constructor()
  {
    this.preloadAudioFile('success-sound.wav');
    this.preloadAudioFile('info-sound.wav');
    this.preloadAudioFile('warning-sound.wav');
    this.preloadAudioFile('error-sound.wav');
  }

  preloadAudioFile(fileName: string) {
    const audio = new Audio();
    audio.src = `assets/audio/${fileName}`;
    audio.load();
    this.audioFiles.set(fileName, audio);
  }

  getAudio(fileName: string): HTMLAudioElement | undefined {
    return this.audioFiles.get(fileName);
  }
}
