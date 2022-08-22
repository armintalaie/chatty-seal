import { Theme } from "./theme";

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
