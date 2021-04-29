import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { GPTHeader, GPTText, NumberInput } from '../../components';
import color from '../../utils/color';

export interface ETCInputPhoneProps {
  onPressBackButton: () => void;
  resetTimer: () => void;
  agreeAndConfirmButton: () => void;
  userName?: string;
  phone: string;
  setPhone: (phone: string) => void;
}

const ETCInputPhone = ({
  onPressBackButton,
  resetTimer,
  agreeAndConfirmButton,
  userName,
  phone,
  setPhone,
}: ETCInputPhoneProps) => {
  const [middleNumber, setMiddleNumber] = useState<string>('••••');
  const [lastNumber, setLastNumber] = useState<string>('••••');
  const [disabled, setDisabled] = useState<boolean>(true);

  const backSpaceButton = (): void => {
    resetTimer();
    // 한자리 지우기
    if (phone.length === 0) {
    } else if (phone.length <= 4) {
      const totalPhone = phone.substring(0, phone.length - 1);
      let nextMiddleNumber = totalPhone;
      while (nextMiddleNumber.length < 4) {
        nextMiddleNumber = nextMiddleNumber + '•';
      }
      setPhone(totalPhone);
      setMiddleNumber(nextMiddleNumber);
    } else if (phone.length <= 8) {
      const totalPhone = phone.substring(0, phone.length - 1);
      let nextLastNumber = totalPhone.substring(4, phone.length - 1);
      while (nextLastNumber.length < 4) {
        nextLastNumber = nextLastNumber + '•';
      }
      setPhone(totalPhone);
      setLastNumber(nextLastNumber);
      setDisabled(true);
    }
  };

  const resetButton = (): void => {
    setPhone('');
  };

  useEffect(() => {
    resetTimer();
    if (phone.length === 0) {
    } else if (phone.length <= 4) {
      const totalPhone = phone.substring(0, phone.length - 1);
      let nextMiddleNumber = totalPhone;
      while (nextMiddleNumber.length < 4) {
        nextMiddleNumber = nextMiddleNumber + '•';
      }
      setPhone(totalPhone);
      setMiddleNumber(nextMiddleNumber);
    } else if (phone.length <= 8) {
      const totalPhone = phone.substring(0, phone.length - 1);
      let nextLastNumber = totalPhone.substring(4, phone.length - 1);
      while (nextLastNumber.length < 4) {
        nextLastNumber = nextLastNumber + '•';
      }
      setPhone(totalPhone);
      setLastNumber(nextLastNumber);
      setDisabled(phone.length !== 7);
    }
  }, [phone, resetTimer, setPhone]);

  const handlePhone = (number: string): void => {
    setPhone(phone + number);
  };

  return (
    <View style={[styles.flex, styles.container]}>
      <GPTHeader onPressBackButton={onPressBackButton} />
      <View style={[styles.flex, styles.content]}>
        <View style={[styles.flex, styles.leftContent]}>
          <View style={[styles.flex, styles.infoArea]}>
            {userName && (
              <Text style={styles.nameTextBase}>
                <GPTText style={{ color: color.theme0 }} fontWeight={500}>
                  {userName}
                </GPTText>
                <GPTText style={{ color: color.black }} fontWeight={500}>
                  님
                </GPTText>
              </Text>
            )}
            <GPTText
              style={[
                {
                  color: color.black,
                },
                styles.subTitleBase,
              ]}
              fontWeight={300}
            >
              <GPTText style={{ color: color.theme0 }} fontWeight={500}>
                복약 관리
              </GPTText>
              <Text> 및 </Text>
              <GPTText style={{ color: color.theme0 }} fontWeight={500}>
                약제비 영수증
              </GPTText>
              <Text>이</Text>
            </GPTText>
            <GPTText
              style={[
                {
                  color: color.black,
                },
                styles.subTitleBase,
              ]}
              fontWeight={300}
            >
              필요하신가요?
            </GPTText>
            <View style={styles.phoneArea}>
              <Text style={styles.phoneText}>
                <GPTText fontWeight={500}>010</GPTText>
                <GPTText> - </GPTText>
                <GPTText fontWeight={500}>{middleNumber}</GPTText>
                <GPTText> - </GPTText>
                <GPTText fontWeight={500}>{lastNumber}</GPTText>
              </Text>
              <View style={styles.separator} />
              <View>
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
          </View>
          <TouchableOpacity onPress={agreeAndConfirmButton} disabled={disabled}>
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
                    color: disabled ? color.blueGrey : color.white,
                  },
                  styles.buttonText,
                ]}
              >
                동의 및 확인
              </GPTText>
            </View>
          </TouchableOpacity>
        </View>
        <NumberInput
          setNumber={handlePhone}
          resetNumber={resetButton}
          backSpace={backSpaceButton}
        />
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
  infoArea: { paddingLeft: 40, paddingBottom: 40, justifyContent: 'flex-end' },
  nameTextBase: {
    fontSize: 44,
    marginTop: 95,
    lineHeight: 62,
    marginBottom: 38,
  },
  subTitleBase: {
    fontSize: 40,
    lineHeight: 62,
  },
  phoneArea: {
    marginLeft: 8,
    marginRight: 108,
    marginTop: 90,
  },
  phoneText: {
    width: '100%',
    fontSize: 59,
    color: color.gray9,
    letterSpacing: 4,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: color.gray10,
    marginTop: 20,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: color.blueGrey,
  },
  button: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 40 },
});

export default ETCInputPhone;
