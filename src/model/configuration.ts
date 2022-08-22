import { DEFAULT_THEME, Theme } from "./theme";

export interface Configration {
  theme: Theme;
  rooms: RoomsConfig;
  users: UsersConfig;
  space: SpaceConfig;
}

interface RoomsConfig {
  showInvite: boolean;
  maxRoomMembers: number;
  showLeave: boolean;
  chatBackup: boolean;
  allowNonSpaceUsers: boolean;
  infoMessage?: string;
}

interface SpaceConfig {
  showAppName: boolean;
  canCustomize: boolean;
}

interface UsersConfig {}

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
