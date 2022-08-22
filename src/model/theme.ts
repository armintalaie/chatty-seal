export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  textcolor: string;
  secondaryTextColor: string;
  isLightMode: boolean;
}

export const DEFAULT_THEME = {
  primaryColor: "#6C9FB2",
  secondaryColor: "#7E8D85",
  textcolor: "#ffffff",
  secondaryTextColor: "#ffffff",
  isLightMode: false,
};
