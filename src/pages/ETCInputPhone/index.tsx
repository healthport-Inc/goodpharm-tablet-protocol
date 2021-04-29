import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { GPTHeader, GPTText, NumberInput } from '../../components';
import color from '../../utils/color';

export interface ETCInputPhoneProps {
  onPressBackButton: () => void;
  resetTimer: () => void;
  agreeAndConfirmButton: (phoneNumber: string) => void;
  userName?: string;
  setPhone: (phoneNumber: string) => void;
  phone: string;
}

const ETCInputPhone = ({
  onPressBackButton,
  resetTimer,
  agreeAndConfirmButton,
  userName,
  phone,
  setPhone,
}: ETCInputPhoneProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [middleNumber, setMiddleNumber] = useState<string>('••••');
  const [lastNumber, setLastNumber] = useState<string>('••••');

  const disabled = useMemo(() => phoneNumber.length !== 8, [phoneNumber]);

  useEffect(() => {
    if (phone) {
      setPhoneNumber(phone.substring(3, phone.length));
      setMiddleNumber(phone.substring(3, 7));
      setLastNumber(phone.substring(7, phone.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPhone(`010${phoneNumber}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

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
      setLastNumber(nextLastNumber);
    }
  };

  const resetButton = (): void => {
    setPhoneNumber('');
    setLastNumber('••••');
    setMiddleNumber('••••');
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
        setLastNumber(nextLastNumber);
        setPhoneNumber(phoneNumber + number);
      }
    }
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
          setNumber={handlePhoneNumber}
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
