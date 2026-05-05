"use client";

import { useEffect } from "react";
import Dojah from "dojah-kyc-sdk-react";
import { Capacitor } from "@capacitor/core";

interface DojahSdkProps {
  shouldRender: boolean;
  setShouldRender: (shouldRender: boolean) => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
  };
  onSubmit: (data?: unknown) => void;
  onError: (err: unknown) => void;
  onClose?: (err?: unknown) => void;
}

// iOS WKWebView requires explicit Permissions Policy on cross-origin iframes
// for getUserMedia to function. Without these, the camera stream freezes.
const IFRAME_ALLOW_PERMISSIONS = [
  "camera",
  "microphone",
  "fullscreen",
  "autoplay",
  "display-capture",
  "encrypted-media",
];

const DojahSdk = ({
  shouldRender,
  setShouldRender,
  userData,
  onSubmit,
  onError,
  onClose,
}: DojahSdkProps) => {
  const appID = process.env.NEXT_PUBLIC_DOJAH_APP_ID || "";
  const publicKey = process.env.NEXT_PUBLIC_DOJAH_PUBLIC_KEY || "";
  const widgetId = process.env.NEXT_PUBLIC_DOJAH_WIDGET_ID || "";

  useEffect(() => {
    if (!shouldRender) return;

    const isIOS = Capacitor.getPlatform() === "ios";

    const patchIframe = (iframe: HTMLIFrameElement) => {
      const currentAllow = iframe.getAttribute("allow") || "";
      const missing = IFRAME_ALLOW_PERMISSIONS.filter(
        (p) => !currentAllow.includes(p)
      );

      if (missing.length > 0) {
        const updated = currentAllow
          ? `${currentAllow}; ${missing.join("; ")}`
          : missing.join("; ");
        iframe.setAttribute("allow", updated);
      }

      if (!iframe.hasAttribute("allowfullscreen")) {
        iframe.setAttribute("allowfullscreen", "true");
      }

      if (isIOS) {
        iframe.style.marginTop = "100px";
      }
    };

    document
      .querySelectorAll<HTMLIFrameElement>("iframe")
      .forEach(patchIframe);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLIFrameElement) {
            patchIframe(node);
          }
          if (node instanceof HTMLElement) {
            node
              .querySelectorAll<HTMLIFrameElement>("iframe")
              .forEach(patchIframe);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [shouldRender]);

  if (!shouldRender || !userData) return null;

  const type = "custom";
  const config = { widget_id: widgetId };

  const user = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    dob: "",
    residence_country: "NG",
    email: userData.email,
  };

  const metadata = { user_id: userData.userId };
  const referenceId = `${userData.userId}-${Date.now()}`;

  const response = (responseType: string, data: unknown) => {
    if (responseType === "success") {
      onSubmit(data);
      setShouldRender(false);
    } else if (responseType === "error") {
      onError(data);
    } else if (responseType === "close") {
      setShouldRender(false);
      onClose?.(data);
    }
  };

  return (
    <Dojah
      response={response}
      appID={appID}
      publicKey={publicKey}
      type={type}
      config={config}
      userData={user}
      metadata={metadata}
      referenceId={referenceId}
    />
  );
};

export default DojahSdk;
