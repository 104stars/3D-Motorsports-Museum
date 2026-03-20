/**
 * Wrapper around the Web Speech API (SpeechSynthesis).
 * Provides speak / pause / resume / stop with event callbacks.
 */
export default class NarrationEngine {
  constructor() {
    this._utterance = null;
    this._isSpeaking = false;
    this._isPaused = false;
    this._currentText = "";

    this.onEnd = null;
    this.onBoundary = null;
    this.onStart = null;
    this.onStateChange = null;
  }

  get isSpeaking() {
    return this._isSpeaking;
  }

  get isPaused() {
    return this._isPaused;
  }

  get isAvailable() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  _emitState() {
    this.onStateChange?.({
      isSpeaking: this._isSpeaking,
      isPaused: this._isPaused,
    });
  }

  speak(text) {
    if (!this.isAvailable) {
      this.onEnd?.();
      return;
    }

    this.stop();

    this._currentText = text;
    this._utterance = new SpeechSynthesisUtterance(text);
    this._utterance.rate = 0.95;
    this._utterance.pitch = 1.0;
    this._utterance.lang = "en-US";

    this._utterance.onstart = () => {
      this._isSpeaking = true;
      this._isPaused = false;
      this._emitState();
      this.onStart?.();
    };

    this._utterance.onend = () => {
      this._isSpeaking = false;
      this._isPaused = false;
      this._emitState();
      this.onEnd?.();
    };

    this._utterance.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") return;
      this._isSpeaking = false;
      this._isPaused = false;
      this._emitState();
      this.onEnd?.();
    };

    this._utterance.onboundary = (e) => {
      this.onBoundary?.(e);
    };

    window.speechSynthesis.speak(this._utterance);
    this._isSpeaking = true;
    this._isPaused = false;
    this._emitState();
  }

  pause() {
    if (!this.isAvailable || !this._isSpeaking || this._isPaused) return;
    window.speechSynthesis.pause();
    this._isPaused = true;
    this._emitState();
  }

  resume() {
    if (!this.isAvailable || !this._isPaused) return;
    window.speechSynthesis.resume();
    this._isPaused = false;
    this._emitState();
  }

  stop() {
    if (!this.isAvailable) return;
    window.speechSynthesis.cancel();
    this._isSpeaking = false;
    this._isPaused = false;
    this._utterance = null;
    this._emitState();
  }

  destroy() {
    this.stop();
    this.onEnd = null;
    this.onBoundary = null;
    this.onStart = null;
    this.onStateChange = null;
  }
}
