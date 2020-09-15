import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import GoodpharmTabletProtocol from 'goodpharm-tablet-protocol';
const {
  initSocketService,
  usePacketReceiver,
  closeSocketService,
  resetSocketService,
  sendPacket,
  encrypt,
} = GoodpharmTabletProtocol;

const init = () => initSocketService();
const close = () => closeSocketService();
const reset = () => resetSocketService();

export default function App() {
  const [buildType, setBuildType] = useState<'dev' | 'prod'>('dev');
  const { serviceStatus } = usePacketReceiver((packet, rawPacket) => {
    console.log(rawPacket, packet);
    setPacket(rawPacket);
    setObject(packet);
  }, buildType);
  const [packet, setPacket] = useState('');
  const [object, setObject] = useState<any>(undefined);
  const [barcode, setBarcode] = useState(
    'UB3<~1KZS1KHEF54NYCBAUBS56WXJMMEP13CU8BUZW6UXKYMDW8B52RDSG3QFNE72K5UX4GA6UKZZXJRWPP61DEN92ZBXFR6RQUF24NT2WW7T819ACWF2V8MF174AM6MKCSK1W72EGZG3C67NAQSSTTBMCD9GZHY8E3BPMNHG8768M2WWDN2BNM1FEAQU77U9E56JC6CJ4HJ2EWZ39V9GGX2CGBVYHKBHNNX175DGVT4K4RKMHXG2VD2QWNRWW1TJA9C3BB1JJF6AGZ98F16AYD8U9W22PMPQCW9JB5NQ42G3GQ8CCYMZB18NGG41G9VJ6XM81CYNYFASVUYR5BCWYJBZNTU3WGKJ5BQT5HK6EJQXF2S731HT5FH3S39W6DJQP3TPEJ2WG7VZSC6PQA3KGEK11U33N3YSYZ3WDE94DGHK4Y556HCSBF5T8NC1WFQ1FN31QFK9VB6GMUNYBBKEYXZ3JGMQUZBA4WMY986DX3S~>'
  );
  const [dustDrugSeq, setDustDrugSeq] = useState('2080908173817');
  const [paymentInfo, setPaymentInfo] = useState<string>(
    '1234123412341234|우리|20000|2000|0|0|0000||12312231|200916130202|031|1234567890|신한카드'
  );

  const toggleBuildType = () =>
    setBuildType((prev) => (prev === 'dev' ? 'prod' : 'dev'));

  const sendProcessedPacket = async (header: string, originPacket: string) => {
    const message =
      buildType === 'prod' ? await encrypt(originPacket) : originPacket;
    sendPacket(header + message);
  };

  return (
    <View style={styles.container}>
      <Text>service : {serviceStatus ? '켜짐' : '꺼짐'}</Text>
      {serviceStatus ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 16,
              justifyContent: 'space-between',
              width: 220,
            }}
          >
            <Button title="close" onPress={close} />
            <Button title="재시작" onPress={reset} />
            <Button title={buildType} onPress={toggleBuildType} />
          </View>
          <Text style={{ marginVertical: 12 }}>{packet}</Text>
          <Text>{JSON.stringify(object)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 150 }}>command=BEBAR</Text>
            <View style={{ width: 900, marginHorizontal: 20 }} />
            <View style={{ justifyContent: 'center', width: 80 }}>
              <Button
                title="보내기"
                onPress={() => {
                  sendProcessedPacket('Command=BEBAR&Body=', '');
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 150 }}>command=BARC</Text>
            <TextInput
              onChange={(e) => setBarcode(e.nativeEvent.text)}
              value={barcode}
              multiline
              style={{ width: 900, marginHorizontal: 20 }}
            />
            <View style={{ justifyContent: 'center', width: 80 }}>
              <Button
                title="보내기"
                onPress={() => {
                  sendProcessedPacket('Command=BARC&Body=', barcode);
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 150 }}>command=DUSTR</Text>
            <TextInput
              onChange={(e) => setDustDrugSeq(e.nativeEvent.text)}
              value={dustDrugSeq}
              multiline
              style={{ width: 900, marginHorizontal: 20 }}
            />
            <View style={{ justifyContent: 'center', width: 80 }}>
              <Button
                title="보내기"
                onPress={() => {
                  sendProcessedPacket('Command=DUSTR&Body=', dustDrugSeq);
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 150 }}>command=REBAR</Text>
            <View style={{ width: 900, marginHorizontal: 20 }} />
            <View style={{ justifyContent: 'center', width: 80 }}>
              <Button
                title="보내기"
                onPress={() => {
                  sendProcessedPacket('Command=REBAR&Body=', '');
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 150 }}>command=PAYI</Text>
            <TextInput
              onChange={(e) => setPaymentInfo(e.nativeEvent.text)}
              value={paymentInfo}
              multiline
              style={{ width: 900, marginHorizontal: 20 }}
            />
            <View style={{ justifyContent: 'center', width: 80 }}>
              <Button
                title="보내기"
                onPress={() => {
                  sendProcessedPacket('Command=PAYI&Body=', paymentInfo);
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <Button title="켜기" onPress={init} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
