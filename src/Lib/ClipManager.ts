import { getConductorManager, getLive } from "./Globals";

export class ClipManager {
  constructor() {}

  public reset(): void {
    const conductor = getConductorManager();
    const live = getLive();
    conductor?.getManagedClips().forEach((clip) => {
      const tarckIndex = live.getTrackIndex(clip.trackName);
      const sceneIndex = live.getSceneIndex(clip.sceneName);
      live.getTrack(tarckIndex).getClipSlot(sceneIndex).deleteClip();
    });
  }
}
