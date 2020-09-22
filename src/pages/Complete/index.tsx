/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import { GPTText } from '../../components';
import color from '../../utils/color';

export interface CompleteProps {
  userName: string;
}

const Complete = ({ userName }: CompleteProps) => {
  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 110 }}>
        <Text style={styles.nameBaseText}>
          <GPTText style={{ color: color.yellow }} fontWeight={700}>
            {userName}
          </GPTText>
          <GPTText fontWeight={500}> 님,</GPTText>
        </Text>

        <GPTText style={styles.subTitleText} fontWeight={500}>
          굿팜 처방전 등록이 완료되었습니다.
        </GPTText>
        <GPTText style={styles.descriptionTextBase} fontWeight={500}>
          잠시 후 카카오톡을 통해
        </GPTText>
        <Text style={styles.descriptionTextBase}>
          <GPTText
            style={{
              color: color.yellow,
            }}
            fontWeight={500}
          >
            굿팜 복약알림 서비스
          </GPTText>
          <GPTText fontWeight={500}>를 받아보실 수 있습니다.</GPTText>
        </Text>
        <GPTText style={styles.descriptionTextBase} fontWeight={500}>
          고객님의 빠른 쾌유를 빕니다.
        </GPTText>
      </View>
      <Image
        style={styles.image}
        source={require('./images/invalid-name.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.theme0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBaseText: {
    fontSize: 50,
    color: color.white,
    lineHeight: 62,
    marginBottom: 10,
  },
  subTitleText: {
    fontSize: 50,
    lineHeight: 62,
    marginBottom: 40,
    color: color.white,
  },
  descriptionTextBase: {
    fontSize: 34,
    lineHeight: 50,
    color: color.white,
  },
  image: {
    width: 428,
    height: 506,
    marginRight: 80,
    marginBottom: 80,
    alignSelf: 'flex-end',
  },
});

export default Complete;
