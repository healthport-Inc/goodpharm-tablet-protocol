import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import color from '../../utils/color';
import GPText from '../GPTText';

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
          hitSlop={{ top: 30, bottom: 30, left: 40, right: 40 }}
          onPress={onPressBackButton}
        >
          <View style={styles.homeButton}>
            <Image
              source={require('./images/ic-home.png')}
              style={styles.homeIcon}
            />
            <GPText style={styles.homeText} fontWeight={500}>
              처음으로
            </GPText>
          </View>
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
  homeButton: {
    marginRight: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: { width: 32, height: 32, marginRight: 12 },
  homeText: {
    marginTop: 4,
    fontSize: 22,
    letterSpacing: -0.85,
    color: color.white,
  },
});
