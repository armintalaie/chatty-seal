export interface Limitation {
  applyTheme: boolean;
  controlInvite: boolean;
  controlLeave: boolean;
  customizeMessage: boolean;
  sendBroadcasts: boolean;
  chatBackup: boolean;
  activeRoomLimit: number;
}

export const DEFAULT_LIMITATION: Limitation = {
  applyTheme: true,
  controlInvite: true,
  controlLeave: true,
  customizeMessage: false,
  sendBroadcasts: false,
  chatBackup: false,
  activeRoomLimit: 10,
};
