import React from 'react';
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
  const { serviceStatus } = usePacketReceiver(() => {}, 'dev');

  return (
    <View style={styles.container}>
      <Text>service : {serviceStatus ? '켜짐' : '꺼짐'}</Text>
      {serviceStatus ? (
        <View>
          <Button title="close" onPress={close} />
          <Button title="재시작" onPress={reset} />
        </View>
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
