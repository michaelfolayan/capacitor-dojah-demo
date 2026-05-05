import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dojah.demo",
  appName: "Dojah Demo",
  webDir: "out",
  ios: {
    preferredContentMode: "mobile",
    limitsNavigationsToAppBoundDomains: false,
  },
  server: {
    allowNavigation: ["*.dojah.io", "*.dojah.services"],
  },
};

export default config;
