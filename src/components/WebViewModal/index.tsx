import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { TermEnum } from '../../interface';
import color from '../../utils/color';

interface Props {
  flag: TermEnum;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  resetTimer: () => void;
}

const WebViewModal = ({ resetTimer, flag, visible, setVisible }: Props) => {
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            resetTimer();
            setVisible(false);
          }}
        >
          <Image
            source={require('./images/btn.png')}
            style={styles.exitButton}
          />
        </TouchableOpacity>
      </View>
      <WebView
        source={{
          uri:
            flag === TermEnum.marketing
              ? 'https://assets.goodpharm.kr/tablet/Terms/marketing.html'
              : flag === TermEnum.personalInfo
              ? 'https://assets.goodpharm.kr/tablet/Terms/personal.html'
              : flag === TermEnum.personalInfoNotice
              ? 'https://assets.goodpharm.kr/tablet/Terms/personal-info-notice.html'
              : flag === TermEnum.sensual
              ? 'https://assets.goodpharm.kr/tablet/Terms/sensual.html'
              : flag === TermEnum.service
              ? 'https://assets.goodpharm.kr/tablet/Terms/service.html'
              : 'https://assets.goodpharm.kr/tablet/Terms/personal.html', // 디폴트
        }}
        onScroll={() => {
          resetTimer();
        }}
        style={styles.webview}
      />
    </Modal>
  );
};

export default WebViewModal;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 86,
    backgroundColor: color.theme0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  exitButton: {
    width: 32,
    height: 32,
    marginRight: 39,
  },
  webview: { flex: 1 },
});
