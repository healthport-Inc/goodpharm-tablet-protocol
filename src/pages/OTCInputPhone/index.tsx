import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { GPTHeader, GPTText, NumberInput } from '../../components';
import color from '../../utils/color';

const renderDataLow = (title: string, description: string) => {
  const lastWord = description.charAt(description.length - 1);
  let sliceStr = description;
  if (
    lastWord ===
    `
`
  ) {
    sliceStr = description.slice(0, -1);
  }
  return (
    <View style={styles.dataRowContainer}>
      <View style={styles.dataRowTitleBox}>
        <GPTText style={styles.dataRowTitle}>{title}</GPTText>
      </View>
      <GPTText style={styles.dataRowDescription}>{sliceStr}</GPTText>
    </View>
  );
};

export interface Props {
  onPressBackButton: () => void;
  resetTimer: () => void;
  agreeAndConfirmButton: (phoneNumber: string) => void;
  data: any;
}

const OTCInputPhone = ({
  resetTimer,
  agreeAndConfirmButton,
  data,
  onPressBackButton,
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [middleNumber, setMiddleNumber] = useState<string>('••••');
  const [lastNumber, setLastNumber] = useState<string>('••••');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isShadow, setIsShadow] = useState<boolean>(false);

  const backSpaceButton = (): void => {
    resetTimer();
    // 한자리 지우기
    if (phoneNumber.length === 0) {
    } else if (phoneNumber.length <= 4) {
      const totalPhone = phoneNumber.substring(0, phoneNumber.length - 1);
      let nextMiddleNumber = totalPhone;
      while (nextMiddleNumber.length < 4) {
        nextMiddleNumber = nextMiddleNumber + '•';
      }
      setPhoneNumber(totalPhone);
      setMiddleNumber(nextMiddleNumber);
    } else if (phoneNumber.length <= 8) {
      const totalPhone = phoneNumber.substring(0, phoneNumber.length - 1);
      let nextLastNumber = totalPhone.substring(4, phoneNumber.length - 1);
      while (nextLastNumber.length < 4) {
        nextLastNumber = nextLastNumber + '•';
      }
      setPhoneNumber(totalPhone);
      setDisabled(true);
      setLastNumber(nextLastNumber);
    }
  };
  const resetButton = (): void => {
    setPhoneNumber('');
    setMiddleNumber('••••');
    setLastNumber('••••');
    setDisabled(true);
  };

  const handlePhoneNumber = (number: string): void => {
    resetTimer();
    if (phoneNumber.length === 0 && number === '0') {
    } else {
      if (phoneNumber.length < 4) {
        let nextMiddleNumber = phoneNumber + number;
        while (nextMiddleNumber.length < 4) {
          nextMiddleNumber = nextMiddleNumber + '•';
        }
        setPhoneNumber(phoneNumber + number);
        setMiddleNumber(nextMiddleNumber);
      } else if (phoneNumber.length < 8) {
        let nextLastNumber =
          phoneNumber.substring(4, phoneNumber.length) + number;
        while (nextLastNumber.length < 4) {
          nextLastNumber = nextLastNumber + '•';
        }
        setPhoneNumber(phoneNumber + number);
        setLastNumber(lastNumber);
        setDisabled(phoneNumber.length === 7 ? false : true);
      }
    }
  };
  /*
Info1 성분
Info2 효능 및 효과
Info3 복용방법
Info4 보관법
*/

  const initScrollShadow = (e: any) => {
    if (e.nativeEvent.layout.height === 380) {
      setIsShadow(true);
    }
  };

  const setScrollShadow = (e: any) => {
    let paddingToBottom = 1;
    paddingToBottom += e.nativeEvent.layoutMeasurement.height;
    if (
      e.nativeEvent.contentOffset.y + paddingToBottom >=
      e.nativeEvent.contentSize.height
    ) {
      setIsShadow(false);
    } else {
      setIsShadow(true);
    }
  };

  return (
    <View style={[styles.flex, styles.container]}>
      <GPTHeader onPressBackButton={onPressBackButton} />
      <View style={[styles.flex, styles.content]}>
        <View style={[styles.flex, styles.leftContent]}>
          <View style={[styles.flex, styles.infoArea]}>
            <View style={[styles.flex, styles.scrollBox]}>
              <ScrollView
                onScroll={setScrollShadow}
                onLayout={initScrollShadow}
                contentContainerStyle={styles.scrollContainer}
                style={styles.flex}
              >
                <View style={[styles.flex, styles.contentContainer]}>
                  {data ||
                  (data &&
                    !data.info1 &&
                    !data.info2 &&
                    !data.info3 &&
                    !data.info4 &&
                    !data.sellingPrice) ? (
                    <>
                      <View style={styles.drugNameBox}>
                        <GPTText style={styles.drugName}>
                          {data.drugName ? data.drugName : ''}
                        </GPTText>
                      </View>
                      {data.sellingPrice !== 0 ? (
                        renderDataLow(
                          '가격',
                          data.sellingPrice.toString() + '원'
                        )
                      ) : (
                        <></>
                      )}
                      {data.info1 ? renderDataLow('성분', data.info1) : <></>}
                      {data.info2 ? renderDataLow('약효', data.info2) : <></>}
                      {data.info3 ? (
                        renderDataLow('복용방법', data.info3)
                      ) : (
                        <></>
                      )}
                      {data.info4 ? (
                        renderDataLow('저장방법', data.info4)
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <View style={[styles.flex, styles.emptyContainer]}>
                      <Image
                        style={styles.emptyImage}
                        source={require('./image/imgNoInfo.png')}
                      />
                      <GPTText style={styles.emptyDescription}>
                        약품 정보가 없습니다. 약사에게 문의해주세요.
                      </GPTText>
                    </View>
                  )}
                </View>
              </ScrollView>
              {isShadow ? (
                <LinearGradient
                  style={styles.shadow}
                  colors={[
                    'rgba(255, 255, 255, 0.3)',
                    'rgba(255, 255, 255, 0.8)',
                  ]}
                />
              ) : (
                <></>
              )}
            </View>
          </View>
          <View style={styles.descriptionBox}>
            <GPTText style={styles.descriptionText}>
              굿팜서비스 이용을 위해 ㈜헬스포트에 성명, 생년월일, 성별,
              휴대전화번호를 수집·이용하는 것에 동의합니다.
            </GPTText>
            <GPTText style={styles.descriptionText}>
              *개인정보 보유 및 이용기간 : 굿팜 이용을 위해 휴대전화번호를
              입력한 날로부터 30일
            </GPTText>
            <GPTText style={styles.descriptionText}>
              {
                '*개인정보 이용 및 수집을 거부하실 권리가 있으며, 거부하실 경우에는 굿팜 서비스 이용이 불가합니다.'
              }
            </GPTText>
          </View>
        </View>
        <View style={{}}>
          <View style={styles.phoneArea}>
            <Text style={styles.phoneText}>
              {/* <GPTText fontWeight={200} style={{letterSpacing: -4}}>
                  0
                </GPTText> */}
              <GPTText fontWeight={200}>010</GPTText>
              <GPTText> - </GPTText>
              <GPTText fontWeight={200}>{middleNumber}</GPTText>
              <GPTText> - </GPTText>
              <GPTText fontWeight={200}>{lastNumber}</GPTText>
            </Text>
            <View style={styles.separator} />
          </View>
          <NumberInput
            setNumber={(number: string) => handlePhoneNumber(number)}
            resetNumber={resetButton}
            backSpace={backSpaceButton}
            style={styles.numberInput}
            textStyle={styles.numberInputText}
            imageStyle={styles.numberInputImage}
          />
          <TouchableOpacity
            onPress={() => agreeAndConfirmButton(phoneNumber)}
            disabled={disabled}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: disabled ? color.gray3 : color.theme0,
                },
              ]}
            >
              <GPTText
                style={[
                  {
                    color: disabled ? color.gray4 : color.theme3,
                  },
                  styles.buttonText,
                ]}
              >
                동의 및 확인
              </GPTText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row' },
  leftContent: {
    width: '100%',
  },
  infoArea: { paddingLeft: 40 },
  phoneArea: {
    marginTop: 52,
    marginBottom: 23,
  },
  phoneText: {
    width: '100%',
    fontSize: 44,
    color: color.gray9,
    letterSpacing: 4,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: color.gray10,
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: color.gray7,
  },
  button: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 28 },
  scrollBox: {
    marginRight: 40,
    marginTop: 40,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: color.gray12,
    marginBottom: 20,
  },
  dataRowContainer: {
    width: 510,
    flexDirection: 'row',
    marginBottom: 20,
  },
  dataRowTitleBox: { width: 92, marginRight: 10 },
  dataRowTitle: {
    fontSize: 23,
    color: color.theme1,
    letterSpacing: 0,
  },
  dataRowDescription: {
    fontSize: 23,
    color: color.gray13,
    letterSpacing: 0,
    lineHeight: 32,
  },
  scrollContainer: {
    borderRadius: 8,
  },
  contentContainer: {
    width: '100%',
    padding: 30,
    borderRadius: 8,
  },
  emptyDescription: {
    fontSize: 28,
    letterSpacing: -0.28,
    color: '#abb1b1',
  },
  drugName: {
    fontSize: 38,
    letterSpacing: -0.5,
    color: color.gray,
  },
  drugNameBox: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 36,
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center' },
  numberInput: {
    flex: 1,
    width: 460,
  },
  emptyImage: { width: 282, height: 211, marginBottom: 35 },
  shadow: {
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
  },
  descriptionBox: {
    alignItems: 'flex-end',
    marginHorizontal: 40,
    marginBottom: 12,
  },
  numberInputText: { fontSize: 38 },
  numberInputImage: { width: 40, height: 40 },
});

export default OTCInputPhone;
