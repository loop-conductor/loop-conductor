import { SceneName, TimeBeatValue, TimeSignature, TrackName } from "./Types";

export class LiveClip {
  private api: LiveAPI;
  private path: string;
  public constructor(path: string) {
    this.path = path;
    this.api = new LiveAPI(() => {}, path);
  }

  public getLength(): number {
    return this.api.get<number[]>("length")[0];
  }

  public isPlaying(): number {
    return this.api.get<number[]>("is_playing")[0];
  }
}

export class LiveClipSlot {
  private api: LiveAPI;
  private path: string;
  public constructor(path: string) {
    this.path = path;
    this.api = new LiveAPI(() => {}, path);
  }

  public getName(): string {
    return this.api.get<string>("name");
  }

  public fire(recordLength?: number): void {
    this.api.call("fire", recordLength);
  }

  public stop(): void {
    this.api.call("stop");
  }

  public hasClip(): boolean {
    return this.api.get<number[]>("has_clip")[0] === 1;
  }

  public getClip(): LiveClip | null {
    if (this.hasClip()) return new LiveClip(this.path + " clip");

    return null;
  }

  public deleteClip(): void {
    if (this.hasClip()) {
      this.api.call("delete_clip");
    }
  }
}

export class LiveTrack {
  private api: LiveAPI;
  private path: string;
  public constructor(path: string) {
    this.path = path;
    this.api = new LiveAPI(() => {}, path);
  }

  public getName(): string {
    return this.api.get<string>("name");
  }

  public arm(on: 0 | 1): void {
    this.api.set("arm", on);
  }

  public getClipSlot(sceneIndex: number): LiveClipSlot {
    return new LiveClipSlot(this.path + " clip_slots " + sceneIndex);
  }
}

export class LiveScene {
  private api: LiveAPI;
  private path: string;
  public constructor(path: string) {
    this.path = path;
    this.api = new LiveAPI(() => {}, path);
  }

  public getName(): string {
    return this.api.get<string>("name");
  }

  public fire(): void {
    this.api.call("fire");
  }
}

export class Live {
  private api: LiveAPI;
  constructor() {
    this.api = new LiveAPI(null, "live_set");
  }

  public getCurrentBeat(): number {
    return this.api.get<number[]>("current_song_time")[0];
  }

  public getClipTriggerQuantization(): number {
    return this.api.get<number[]>("clip_trigger_quantization")[0];
  }

  public getCurrentTimeSignature(): TimeSignature {
    return {
      beatsPerBar: this.api.get<number[]>("signature_numerator")[0],
      beatValue: this.api.get<TimeBeatValue[]>("signature_denominator")[0],
    };
  }

  public setMetronome(onOff: 0 | 1): void {
    this.api.set("metronome", onOff);
  }

  public setTempo(tempo: number): void {
    this.api.set("tempo", tempo);
  }

  public setSessionRecord(onOff: 0 | 1): void {
    this.api.set("session_record", onOff);
  }

  public getTrack(nameOrIndex: TrackName): LiveTrack {
    const trackIndex = this.getTrackIndex(nameOrIndex);
    var trackPath = "live_set tracks " + trackIndex;
    return new LiveTrack(trackPath);
  }

  public isValidTrack(nameOrIndex: TrackName): boolean {
    return this.getTrackIndex(nameOrIndex) >= 0;
  }

  public getScene(nameOrIndex: SceneName): LiveScene {
    const sceneIndex = this.getSceneIndex(nameOrIndex);
    var scenePath = "live_set scenes " + sceneIndex;
    return new LiveScene(scenePath);
  }

  public isValidScene(nameOrIndex: SceneName): boolean {
    return this.getSceneIndex(nameOrIndex) >= 0;
  }

  public getTrackCount(): number {
    return this.api.getcount("tracks");
  }

  public getTrackIndex(name: TrackName): number {
    const numTracks = this.getTrackCount();
    if (typeof name === "number") {
      if (name < numTracks) {
        return name;
      }
      return -1;
    }

    for (var i = 0; i < numTracks; i++) {
      const track = this.getTrack(i);
      // Get the name of the track
      var trackName = track.getName();

      if (trackName == name) {
        return i;
      }
    }
    return -1;
  }

  public getSceneIndex(name: SceneName): number {
    const numScenes = this.api.getcount("scenes");
    if (typeof name === "number") {
      if (name < numScenes) {
        return name;
      }
      return -1;
    }

    for (var i = 0; i < numScenes; i++) {
      const scene = this.getScene(i);
      // Get the name of the track
      var sceneName = scene.getName();

      if (sceneName == name) {
        return i;
      }
    }
    return -1;
  }

  public unarmAllTracks(): void {
    const numTracks = this.getTrackCount();
    for (var i = 0; i < numTracks; i++) {
      this.getTrack(i).arm(0);
    }
  }
}
