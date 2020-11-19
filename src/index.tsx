import { useState, useEffect, DependencyList } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

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
  NetworkAgentCodeType,
  AgentCodeType,
} from './interface';

const {
  sendPacket,
  getSocketStatus,
  getSocketCount,
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

export const makeParams = (data: any) => {
  const params = new URLSearchParams();
  for (let key in data) {
    // @ts-ignore
    params.append(key, data[key]);
  }
  return params;
};

const addTabletLog = async (logMsg: string) => {
  try {
    const settingJson = await AsyncStorage.getItem('goodpharm-setting');
    if (settingJson) {
      const { tabletId } = JSON.parse(settingJson);
      if (tabletId) {
        const params = makeParams({
          tabletId,
          logType: 'tablet-protocol',
          logMsg,
        });

        await axios.post(
          `https://api.goodpharm.kr/api/v1/tablet/add/log`,
          params
        );
      } else {
        console.log('tabletId id not found');
      }
    } else {
      console.log('setting not found');
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePacket = (packetString: string): PacketType => {
  if (
    packetString.includes(String.fromCharCode(2)) &&
    packetString.includes('D4')
  ) {
    return undefined;
  }

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
    const code = bodyArray[0] as NetworkAgentCodeType;
    const message = bodyArray[1];
    const agentCode = bodyArray[2] as AgentCodeType;

    return {
      command,
      code,
      message,
      agentCode,
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
  } else if (
    packetString.includes(
      `${String.fromCharCode(52)}D4${String.fromCharCode(28)}`
    )
  ) {
    return undefined;
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
  const [serviceCount, setServiceCount] = useState<number>(getSocketCount());

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.GoodpharmTabletProtocol
    );
    const packetEventListener = eventEmitter.addListener(
      'receivePacket',
      async (event: { packet: string }) => {
        addTabletLog(`receive packet ${event.packet}`);
        try {
          const packet =
            buildType === 'dev'
              ? event.packet
              : await GoodpharmModule.decrypt(event.packet);
          const result = handlePacket(packet);
          callBack(result, packet);
        } catch (error) {
          addTabletLog(`native log listener ${error}`);
          console.log(error);
        }
      }
    );
    const serviceEventListener = eventEmitter.addListener(
      'serviceStatus',
      (event: { status: boolean; count: number }) => {
        addTabletLog(`service status is ${event.status}`);
        setServiceStatus(event.status);
        setServiceCount(event.count);
      }
    );
    const socketLogListener = eventEmitter.addListener(
      'socketLog',
      (event: { msg: string; error?: string }) => {
        addTabletLog(`native log listener ${event.msg} ${event.error}`);
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

  return { serviceStatus, serviceCount };
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
