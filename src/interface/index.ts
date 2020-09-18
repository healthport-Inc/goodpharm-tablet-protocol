export interface VideoInfo {
  versionId: string;
  url: string;
}

export enum TermEnum {
  service,
  personalInfo,
  sensual,
  marketing,
  personalInfoNotice,
}

export interface BasePacketType {
  userName: string;
  userToken: string;
  drugSeq: string;
}

export interface DIREPacketType {
  command: 'DIRE';
}
export interface CommonPacketType extends BasePacketType {
  command: 'AUTH' | 'DIREN' | 'REMO' | 'COMPC';
  askDate: string;
}
export interface AGREPacketType {
  command: 'AGRE';
}
export interface NAGREPacketType {
  command: 'NAGRE';
}
export interface AUTHCPacketType extends BasePacketType {
  command: 'AUTHC';
  phoneArray: string[];
  askDate: string;
}
export interface DIREUPacketType extends BasePacketType {
  command: 'DIREU';
  phoneArray: string[];
  askDate: string;
}

// kiosk 전용

export interface BEBARPacketType {
  command: 'BEBAR';
}
export interface PRESPacketType extends BasePacketType {
  command: 'PRES';
  hospital: string;
  totalPrice: string;
  realPrice: string;
  insertPrice: string;
  isDust: boolean;
}

export interface ERRKIPacketType {
  command: 'ERRKI';
  code: string;
  message: string;
}

export type PacketType =
  | DIREPacketType
  | CommonPacketType
  | AGREPacketType
  | NAGREPacketType
  | AUTHCPacketType
  | DIREUPacketType
  | BEBARPacketType
  | PRESPacketType
  | ERRKIPacketType
  | undefined;
