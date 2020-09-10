import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import GoodpharmTabletProtocol from 'goodpharm-tablet-protocol';
const {
  initSocketService,
  usePacketReceiver,
  closeSocketService,
} = GoodpharmTabletProtocol;

export default function App() {
  useEffect(() => {
    initSocketService();
  }, []);

  const { serviceStatus } = usePacketReceiver(() => {}, 'dev');

  return (
    <View style={styles.container}>
      <Text>Result: {String(serviceStatus)}</Text>
      {serviceStatus ? (
        <Button title="close" onPress={closeSocketService} />
      ) : (
        <Button title="켜기" onPress={initSocketService} />
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
