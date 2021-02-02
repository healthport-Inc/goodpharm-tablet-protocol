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

export interface AUTHPPacketType extends BasePacketType {
  command: 'AUTHP';
  askDate: string;
  purchaseId: string;
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
  command: 'PRES' | 'PRESS';
  hospital: string;
  totalPrice: string;
  realPrice: string;
  insertPrice: string;
  isDust: boolean;
}

// otc 추가
export interface OTCPacketType {
  command: 'OTCE' | 'OTC';
  barcode: string;
  drugName: string;
  sellingPrice: number;
  buyingPrice: number;
  supName: string;
  count: number;
}

export interface OTCItemType {
  barcode: string;
  sellingPrice: number;
  count: number;
}

export interface ConfirmPacketType {
  command: 'CONFE' | 'CONFSP' | 'CONF_CASH' | 'CONF_CARD';
  totalAmount: number;
  saleAmount: number;
  tax: number;
  phone: string;
  otcList: OTCItemType[];
  prescriptions: string[];
}

export interface ResetPacketType {
  command: 'RESET';
}

export interface RemovePresPacketType {
  command: 'REPRESS';
  drugSeq: string;
}

export interface AuthOtcPacketType {
  command: 'AUTHOTC';
  purchaseId: string;
}

export interface UnRegisteredOTCPacketType {
  command: 'UNREGOTC';
}

/**
 * @type {E001} V코드(산정특래환자) | v252, v352 제외 | 동내병원X, 상급기관 가면, 본인부담금 가중
 * @type {E002} 병용금기 점검(DUR) | 병용금기 점검사항 발생시
 * @type {E003} 의료급여환자 | 0, 500원 의료급여 환자들
 * @type {E004} 유효기간 초과 | 처방전 유효기간 조회 초과 발새시
 * @type {E005} 처방전오류  | 발행기관기호 누락 or 교부번호 누락시
 * @type {E006} 처방전중복  | 발행기관기호 & 처방전발행번호 중복시
 * @type {E007} 비보험처방  | 약품가격이 0원, 해당약품 코드가 없는 경우
 * @type {E008} 산재처방전  | 산업재해 발생
 * @type {E009} 자동차보험  | 교통사고 발생
 * @type {E010} 기타종별  | 보험감면 환자, 차상위 계층 (보훈/공무원상해/차상위/희귀난치/장기요양/전상군경) | 자격조회등 복잡한 조회 필요
 * @type {E011} 6세미만 소아  | 환자 상태를 확인 하기 위해/대면 서비스 유도 | * 자동처리 가능
 * @type {E012} 65세이상 노인 | 환자 상태를 확인 하기 위해/대면 서비스 유도 | * 자동처리 가능
 * @type {E013} 미자격자  | 건강/의료급여 미자격자 or 조회 오류
 * @type {E021} 외용제 및 점안액  | 처방전 내용 기준으로 적용 | 옵션처리 (처방전 내용을 믿고 사용/미사용)
 * @type {E022} 단가없는 비보험 | 미등록(코드가없는) 제품
 * @type {E023} 임부금기  | 처방전 내용 기준으로 적용 | 옵션처리 (처방전 내용을 믿고 사용/미사용)
 * @type {E024} 미취급 제품 | 등록은 되어 있지만, 취급한 적이 없는 제품(대체 조제 유도)
 * @type {E025} 마약류제품
 * @type {E999} 기타 오류 | 알수없는 오류
 */
export type AgentCodeType =
  | 'E001'
  | 'E002'
  | 'E003'
  | 'E004'
  | 'E005'
  | 'E006'
  | 'E007'
  | 'E008'
  | 'E009'
  | 'E010'
  | 'E011'
  | 'E012'
  | 'E013'
  | 'E021'
  | 'E022'
  | 'E023'
  | 'E024'
  | 'E025'
  | 'E999';

/**
 * @type {1000} 서비스 이용할 수 없음 (굿팜 서비스 익셉션)
 * @type {1001} 중복된 바코드 요청
 * @type {1002} 현재 다른 처방전 처리중
 * @type {1003} 에이전트 내부 에러 (약사에게 바로 가야 함)
 * @type {1004} 잘못된 요청
 * @type {2000} 서비스 예외 발생
 */
export type NetworkAgentCodeType =
  | '1000'
  | '1001'
  | '1002'
  | '1003'
  | '1004'
  | '2000';

export interface ERRKIPacketType {
  command: 'ERRKI';
  code: NetworkAgentCodeType;
  agentCode: AgentCodeType;
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
  | OTCPacketType
  | ConfirmPacketType
  | ResetPacketType
  | RemovePresPacketType
  | AuthOtcPacketType
  | UnRegisteredOTCPacketType
  | AUTHPPacketType
  | undefined;
