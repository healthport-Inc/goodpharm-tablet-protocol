import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import color from '../../utils/color';

export interface Props {
  rightHeaderHidden?: boolean;
  onPressBackButton: () => void;
}

const GPTHeader = ({ onPressBackButton, rightHeaderHidden }: Props) => {
  return (
    <View style={styles.container}>
      {rightHeaderHidden ? (
        <View />
      ) : (
        <TouchableOpacity
          onPress={onPressBackButton}
          hitSlop={{ top: 25, bottom: 25, left: 40, right: 70 }}
        >
          <Image
            source={require('./images/left-arrow.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      )}
      <Image
        source={require('./images/header_logo.png')}
        style={styles.headerLogo}
      />
    </View>
  );
};

export default GPTHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.theme0,
    width: '100%',
    height: 86,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 18,
    height: 32,
    marginLeft: 40,
  },
  headerLogo: {
    width: 70,
    height: 34,
    marginRight: 40,
  },
});
