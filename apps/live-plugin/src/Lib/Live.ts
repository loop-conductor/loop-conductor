import {
  SceneName,
  TimeBeatValue,
  TimeSignature,
  TrackName,
} from "@loop-conductor/common";

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
  private live: Live;
  public constructor(path: string, live: Live) {
    this.path = path;
    this.live = live;
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
  private live: Live;

  public constructor(path: string, live: Live) {
    this.path = path;
    this.live = live;
    this.api = new LiveAPI(() => {}, path);
  }

  public getName(): string {
    return this.api.get<string>("name");
  }

  public arm(on: 0 | 1): void {
    this.api.set("arm", on);
  }

  public getClipSlot(sceneName: SceneName): LiveClipSlot {
    const sceneIndex = this.live.getSceneIndex(sceneName);
    return new LiveClipSlot(this.path + " clip_slots " + sceneIndex, this.live);
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
    return new LiveTrack(trackPath, this);
  }

  public isValidTrack(nameOrIndex: TrackName): boolean {
    return this.getTrackIndex(nameOrIndex) >= 0;
  }

  public getScene(nameOrIndex: SceneName): LiveScene {
    const sceneIndex = this.getSceneIndex(nameOrIndex);
    var scenePath = "live_set scenes " + sceneIndex;
    return new LiveScene(scenePath);
  }

  public isValidSceneName(nameOrIndex: SceneName): boolean {
    return this.getSceneIndex(nameOrIndex) > 0;
  }

  public getTrackCount(): number {
    return this.api.getcount("tracks");
  }

  /**
   * Translate from a track name to a track index.
   * Track names are 1-indexed an/or can be strings.
   * Track indexes are 0-indexed. (They are used by the live api)
   *
   * @param trackName The track name
   * @returns The 0 indexed track index
   */
  public getTrackIndex(name: TrackName): number {
    const numTracks = this.getTrackCount();
    if (typeof name === "number") {
      if (name > 0 && name <= numTracks) {
        return name - 1;
      }
      return -1;
    }

    for (var i = 1; i <= numTracks; i++) {
      const track = this.getTrack(i);
      // Get the name of the track
      var trackName = track.getName();

      if (trackName == name) {
        return i - 1;
      }
    }
    return -1;
  }

  /**
   * Translate from a scene name to a scene index.
   * Scene names are 1-indexed an/or can be strings.
   * Scene indexes are 0-indexed. (They are used by the live api)
   *
   * @param sceneName The scene name
   * @returns The 0 indexed scene index
   */
  public getSceneIndex(sceneName: SceneName): number {
    const numScenes = this.api.getcount("scenes");
    if (typeof sceneName === "number") {
      if (sceneName > 0 && sceneName <= numScenes) {
        return sceneName - 1;
      }
      return -1;
    }

    for (var i = 1; i <= numScenes; i++) {
      const scene = this.getScene(i);
      // Get the name of the track
      if (scene.getName() == sceneName) {
        return i - 1;
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
