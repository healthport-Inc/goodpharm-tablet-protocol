# goodpharm-tablet-protocol

굿팜 태블릿 및 키오스크 공통모듈

## Installation

```sh
npm install https://github.com/healthport-Inc/goodpharm-tablet-protocol
```

## Usage

```js
import GoodpharmTabletProtocol from "goodpharm-tablet-protocol";

// 암호화 복호화
const encryptedString = await GoodpharmTabletProtocol.encrypt(msg);
const decryptedString = await GoodpharmTabletProtocol.decrypt(encryptedString);


// 패킷 보내기
GoodpharmTabletProtocol.sendPacket(msg)

// 소켓 서비스 시작, 닫기, 리셋
GoodpharmTabletProtocol.initSocketService()
GoodpharmTabletProtocol.closeSocketService()
GoodpharmTabletProtocol.resetSocketService()

// 패킷 리시버 훅스
// buildType : 'dev' | 'prod'
const callBack = (packet: PacketType, rawPacket: string) => {
  //...
}
const { serviceStatus } = GoodpharmTabletProtocol.usePacketReceiver(callBack,'dev')
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

