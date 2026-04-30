declare module 'dojah-kyc-sdk-react' {
  import { ComponentType } from 'react';

  interface DojahConfig {
    widget_id: string;
  }

  interface DojahUserData {
    first_name?: string;
    last_name?: string;
    dob?: string;
  }

  interface DojahMetadata {
    user_id?: string;
    email?: string;
    [key: string]: unknown;
  }

  interface DojahGovData {
    bvn?: string;
    nin?: string;
    dl?: string;
    mobile?: string;
  }

  interface DojahProps {
    response: (type: string, data: unknown) => void;
    appID: string;
    publicKey: string;
    type: string;
    config: DojahConfig;
    userData?: DojahUserData;
    metadata?: DojahMetadata;
    govData?: DojahGovData;
    referenceId?: string;
  }

  const Dojah: ComponentType<DojahProps>;
  export default Dojah;
}