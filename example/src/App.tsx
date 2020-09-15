import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import GoodpharmTabletProtocol from 'goodpharm-tablet-protocol';
const {
  initSocketService,
  usePacketReceiver,
  closeSocketService,
  resetSocketService,
} = GoodpharmTabletProtocol;

const init = () => initSocketService();
const close = () => closeSocketService();
const reset = () => resetSocketService();

export default function App() {
  const { serviceStatus } = usePacketReceiver((packet, rawPacket) => {
    console.log(rawPacket, packet);
    setPacket(rawPacket);
    setObject(packet);
  }, 'dev');
  const [packet, setPacket] = useState('');
  const [object, setObject] = useState<any>(undefined);

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
              width: 200,
            }}
          >
            <Button title="close" onPress={close} />
            <Button title="재시작" onPress={reset} />
          </View>
          <Text style={{ marginVertical: 12 }}>{packet}</Text>
          <Text>{JSON.stringify(object)}</Text>
        </>
      ) : (
        <>
          <Button title="켜기" onPress={init} />
          <Button title="close" onPress={close} />
        </>
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
