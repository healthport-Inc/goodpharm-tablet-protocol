import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

import { GoodpharmScreens } from './pages';

import type {
  PacketType,
  VideoInfo,
  TermEnum,
  BasePacketType,
  DIREPacketType,
  CommonPacketType,
  AGREPacketType,
  NAGREPacketType,
  AUTHCPacketType,
  DIREUPacketType,
  BEBARPacketType,
  PRESPacketType,
} from './interface';

const {
  sendPacket,
} = NativeModules.GoodpharmTabletProtocol as GoodpharmTabletProtocolType;

const ERROR_PACKET_HEADER = 'Command=ERROR&Body=';

type GoodpharmTabletProtocolType = {
  encrypt: (string: string) => Promise<string>;
  decrypt: (encryptedString: string) => Promise<string>;
  sendPacket: (packet: string) => void;
  initSocketService: () => void;
  closeSocketService: () => void;
  resetSocketService: () => void;
};

const handlePacket = (packetString: string): PacketType => {
  const packetArray = packetString.split('&');
  if (
    packetArray[0] === undefined ||
    packetArray[1] === undefined ||
    packetArray[0].split('=')[1] === undefined ||
    packetArray[1].split('=')[1] === undefined
  ) {
    sendPacket(ERROR_PACKET_HEADER + packetString);
    return undefined;
  }
  const command = packetArray[0].split('=')[1];
  const body = packetArray[1].split('=')[1];
  if (command === 'DIRE') {
    return {
      command,
    };
  }
  const bodyArray = body.split('|');

  if (
    bodyArray[0] === undefined ||
    bodyArray[1] === undefined ||
    bodyArray[2] === undefined
  ) {
    sendPacket(ERROR_PACKET_HEADER + packetString);
    return undefined;
  }
  const userName = bodyArray[0];
  const userToken = bodyArray[1];
  const drugSeq = bodyArray[2];

  if (command === 'AUTH') {
    if (bodyArray[3] === undefined) {
      sendPacket(ERROR_PACKET_HEADER + packetString);
      return undefined;
    }
    const askDate = bodyArray[3];

    return {
      command,
      userName,
      userToken,
      drugSeq,
      askDate,
    };
  } else if (command === 'AGRE' || command === 'NAGRE') {
    return {
      command,
    };
  } else if (command === 'AUTHC') {
    if (bodyArray[3] === undefined || bodyArray[4] === undefined) {
      sendPacket(ERROR_PACKET_HEADER + packetString);
      return undefined;
    }
    const askDate = bodyArray[3];
    const phoneArray = bodyArray[4].split(',');

    return {
      command,
      userName,
      userToken,
      drugSeq,
      askDate,
      phoneArray,
    };
  } else if (command === 'DIREU') {
    if (bodyArray[3] === undefined || bodyArray[4] === undefined) {
      sendPacket(ERROR_PACKET_HEADER + packetString);
      return undefined;
    }
    const askDate = bodyArray[3];
    const phoneArray = bodyArray[4].split(',');

    return {
      command,
      userName,
      userToken,
      drugSeq,
      askDate,
      phoneArray,
    };
  } else if (command === 'DIREN') {
    if (bodyArray[3] === undefined) {
      sendPacket(ERROR_PACKET_HEADER + packetString);
      return undefined;
    }
    const askDate = bodyArray[3];

    return {
      command,
      userName,
      userToken,
      drugSeq,
      askDate,
    };
  } else if (command === 'REMO') {
    if (bodyArray[3] === undefined) {
      sendPacket(ERROR_PACKET_HEADER + packetString);
      return undefined;
    }
    const askDate = bodyArray[3];

    return {
      command,
      userName,
      userToken,
      drugSeq,
      askDate,
    };
  } else {
    sendPacket(ERROR_PACKET_HEADER + packetString);
    return undefined;
  }
};

const GoodpharmModule: GoodpharmTabletProtocolType = {
  ...NativeModules.GoodpharmTabletProtocol,
};

const usePacketReceiver = (
  callBack: (packet: PacketType, rawPacket: string) => void,
  buildType: 'dev' | 'prod'
) => {
  const [serviceStatus, setServiceStatus] = useState<boolean>(false);
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.GoodpharmTabletProtocol
    );
    console.log('make hook');
    const packetEventListener = eventEmitter.addListener(
      'receivePacket',
      async (event: { packet: string }) => {
        try {
          console.log(event);
          const packet =
            buildType === 'dev'
              ? event.packet
              : await GoodpharmModule.decrypt(event.packet);
          const result = handlePacket(packet);
          callBack(result, packet);
        } catch (error) {
          console.error(error);
        }
      }
    );
    const serviceEventListener = eventEmitter.addListener(
      'serviceStatus',
      (event: { status: boolean }) => {
        console.log('event.status', event);
        setServiceStatus(event.status);
      }
    );
    const socketLogListener = eventEmitter.addListener(
      'socketLog',
      (event: { msg: string; error?: string }) => {
        console.log(event);
      }
    );

    return () => {
      packetEventListener.remove();
      serviceEventListener.remove();
      socketLogListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { serviceStatus };
};

const GoodpharmTabletProtocol = {
  ...GoodpharmModule,
  usePacketReceiver,
};

export { GoodpharmScreens };

export default GoodpharmTabletProtocol;

export type {
  PacketType,
  VideoInfo,
  TermEnum,
  BasePacketType,
  DIREPacketType,
  CommonPacketType,
  AGREPacketType,
  NAGREPacketType,
  AUTHCPacketType,
  DIREUPacketType,
  BEBARPacketType,
  PRESPacketType,
};
