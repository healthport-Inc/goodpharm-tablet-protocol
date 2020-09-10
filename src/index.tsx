import { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

type GoodpharmTabletProtocolType = {
  multiply: (a: number, b: number) => Promise<number>;
  encrypt: (string: string) => Promise<string>;
  decrypt: (encryptedString: string) => Promise<string>;
  sendPacket: (packet: string) => void;
  initSocketService: () => void;
  closeSocketService: () => void;
  resetSocketService: () => void;
};

interface BasePacketType {
  userName: string;
  userToken: string;
  drugSeq: string;
  askDate: string;
}

interface DIREPacketType {
  command: 'DIRE';
}
interface CommonPacketType extends BasePacketType {
  command: 'AUTH' | 'DIREN' | 'REMO';
}
interface AGREPacketType {
  command: 'AGRE';
}
interface NAGREPacketType {
  command: 'NAGRE';
}
interface AUTHCPacketType extends BasePacketType {
  command: 'AUTHC';
  phoneArray: string[];
}
interface DIREUPacketType extends BasePacketType {
  command: 'DIREU';
  phoneArray: string[];
}

type PacketType =
  | DIREPacketType
  | CommonPacketType
  | AGREPacketType
  | NAGREPacketType
  | AUTHCPacketType
  | DIREUPacketType
  | undefined;

const handlePacket = (packetString: string): PacketType => {
  const packetArray = packetString.split('&');
  const {
    sendPacket,
  } = NativeModules.GoodpharmTabletProtocol as GoodpharmTabletProtocolType;

  if (
    packetArray[0] === undefined ||
    packetArray[1] === undefined ||
    packetArray[0].split('=')[1] === undefined ||
    packetArray[1].split('=')[1] === undefined
  ) {
    sendPacket('Command=ERROR&Body=' + packetString);
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
    sendPacket('Command=ERROR&Body=' + packetString);
    return undefined;
  }
  const userName = bodyArray[0];
  const userToken = bodyArray[1];
  const drugSeq = bodyArray[2];

  if (command === 'AUTH') {
    if (bodyArray[3] === undefined) {
      sendPacket('Command=ERROR&Body=' + packetString);
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
      sendPacket('Command=ERROR&Body=' + packetString);
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
      sendPacket('Command=ERROR&Body=' + packetString);
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
      sendPacket('Command=ERROR&Body=' + packetString);
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
      sendPacket('Command=ERROR&Body=' + packetString);
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
    sendPacket('Command=ERROR&Body=' + packetString);
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
  const [serviceStatus, setServiceStatus] = useState<boolean>(true);
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.GoodpharmTabletProtocol
    );
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
        console.log(event);
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

export default GoodpharmTabletProtocol;
