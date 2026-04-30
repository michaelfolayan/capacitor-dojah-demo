"use client";

import { useEffect } from "react";
import Dojah from "dojah-kyc-sdk-react";

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
    if (shouldRender) {
      const adjustPosition = async () => {
        // this is because on ios devices with island design, the iframe top is blocked by the island/notch
        let el: HTMLElement | null = null;
        let maxCheckCount = 20;
        while (!el && maxCheckCount > 0) {
          el = document.querySelector("iframe") as HTMLElement;
          maxCheckCount--;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (el) {
          el.style.marginTop = "100px";
        }
      };

      const timer = setTimeout(adjustPosition, 800);
      return () => clearTimeout(timer);
    }
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
