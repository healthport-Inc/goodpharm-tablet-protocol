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
  askDate: string;
}

export interface DIREPacketType {
  command: 'DIRE';
}
export interface CommonPacketType extends BasePacketType {
  command: 'AUTH' | 'DIREN' | 'REMO';
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
}
export interface DIREUPacketType extends BasePacketType {
  command: 'DIREU';
  phoneArray: string[];
}

// kiosk 전용

export interface BEBARPacketType {
  command: 'BEBAR';
}
export interface PRESPacketType extends BasePacketType {
  command: 'PRES';
  hospital: string;
  //총 약제비
  //본인부담금
  //보험청구액
  isDust: boolean;
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
  | undefined;
