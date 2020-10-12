import { useState, useEffect, DependencyList } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

import GoodpharmScreens from './pages';

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
  ERRKIPacketType,
} from './interface';

const {
  sendPacket,
  getSocketStatus,
} = NativeModules.GoodpharmTabletProtocol as GoodpharmTabletProtocolType;

const ERROR_PACKET_HEADER = 'Command=ERROR&Body=';

type GoodpharmTabletProtocolType = {
  encrypt: (string: string) => Promise<string>;
  decrypt: (encryptedString: string) => Promise<string>;
  sendPacket: (packet: string) => void;
  initSocketService: () => void;
  closeSocketService: () => void;
  resetSocketService: () => void;
  getSocketCount: () => number;
  getSocketStatus: () => boolean;
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
  if (command === 'DIRE' || command === 'BEBAR') {
    return {
      command,
    };
  }

  const body = packetArray[1].split('=')[1];

  if (body === null) {
    sendPacket(ERROR_PACKET_HEADER + packetString);
    return undefined;
  }

  const bodyArray = body.split('|');

  if (command === 'PRES') {
    const drugSeq = bodyArray[0];
    const userName = bodyArray[1];
    const userToken = bodyArray[2];
    const hospital = bodyArray[3];
    const totalPrice = bodyArray[4];
    const realPrice = bodyArray[5];
    const insertPrice = bodyArray[6];
    const isDust = bodyArray[7] === '1';

    return {
      command,
      drugSeq,
      userName,
      userToken,
      hospital,
      totalPrice,
      realPrice,
      insertPrice,
      isDust,
    };
  }

  if (command === 'ERRKI') {
    const code = bodyArray[0];
    const message = bodyArray[1];
    return {
      command,
      code,
      message,
    };
  }

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

  if (
    command === 'AUTH' ||
    command === 'COMPC' ||
    command === 'DIREN' ||
    command === 'REMO'
  ) {
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
  deps: DependencyList,
  buildType: 'dev' | 'prod'
) => {
  const [serviceStatus, setServiceStatus] = useState<boolean>(
    getSocketStatus()
  );
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.GoodpharmTabletProtocol
    );
    const packetEventListener = eventEmitter.addListener(
      'receivePacket',
      async (event: { packet: string }) => {
        try {
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
  }, [buildType, callBack, ...deps]);

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
  ERRKIPacketType,
};
