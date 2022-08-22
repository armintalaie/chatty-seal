import { Configration } from "./spaceInfo/configuration";
import { Limitation } from "./spaceInfo/limitation";

export const DEFAULT_THEME = {
  primaryColor: "#6C9FB2",
  secondaryColor: "#7E8D85",
  textcolor: "#ffffff",
  secondaryTextColor: "#ffffff",
  isLightMode: false,
};

export const DEFAULT_CONFIG: Configration = {
  theme: DEFAULT_THEME,
  rooms: {
    showInvite: true,
    maxRoomMembers: 3,
    showLeave: true,
    chatBackup: true,
    allowNonSpaceUsers: true,
    infoMessage: "",
  },
  users: {},
  space: {
    canCustomize: true,
    showAppName: true,
  },
};

export const DEFAULT_LIMITATION: Limitation = {
  applyTheme: true,
  controlInvite: true,
  controlLeave: true,
  customizeMessage: false,
  sendBroadcasts: false,
  chatBackup: false,
  activeRoomLimit: 10,
};
