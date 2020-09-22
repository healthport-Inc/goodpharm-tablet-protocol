import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { TermEnum } from '../../interface';
import color from '../../utils/color';
import {
  GPTHeader,
  GPTText,
  WebViewModal,
  AgreementButton,
} from '../../components';

export interface AgreementProps {
  resetTimer: () => void;
  // agreement: boolean;
  // toggleAgreement: () => void;
  userName: string;
  onPressBackButton: () => void;
  navigateToComplete: () => void;
}

const Agreement = ({
  resetTimer,
  // agreement,
  // toggleAgreement,
  userName,
  onPressBackButton,
  navigateToComplete,
}: AgreementProps) => {
  const [serviceTerm, setServiceTerm] = useState<boolean>(false);
  const [personalInfoTerm, setPersonalInfoTerm] = useState<boolean>(false);
  const [sensualTerm, setSensualTerm] = useState<boolean>(false);
  const [flag, setFlag] = useState<TermEnum>(TermEnum.personalInfo);
  const [modalVisible, setModalVisible] = useState(false);

  const viewTerm = (term: TermEnum) => {
    resetTimer();
    setFlag(term);
    setModalVisible(true);
  };

  const setAllAgree = () => {
    setServiceTerm(true);
    setPersonalInfoTerm(true);
    setSensualTerm(true);
  };

  const toggleServiceTerm = () => {
    setServiceTerm((prev) => !prev);
  };

  const viewServiceTerm = () => {
    viewTerm(TermEnum.service);
  };

  // const setMarketingTerm = () => {
  //   resetTimer();
  //   toggleAgreement();
  // };
  // const viewMarketingTerm = () => {
  //   viewTerm(TermEnum.marketing);
  // };

  const togglePersonalInfo = () => {
    resetTimer();
    setPersonalInfoTerm((prev) => !prev);
  };
  const viewPersonalInfo = () => {
    viewTerm(TermEnum.personalInfo);
  };
  const toggleSensualTerm = () => {
    resetTimer();
    setSensualTerm((prev) => !prev);
  };
  const viewSensualTerm = () => {
    viewTerm(TermEnum.sensual);
  };

  const viewPersonalInfoNotice = () => {
    viewTerm(TermEnum.personalInfoNotice);
  };

  const _navigateToComplete = () => {
    //AURTA
    resetTimer();
    navigateToComplete();
  };

  const totalAgree: boolean = personalInfoTerm && sensualTerm && serviceTerm; //&& agreement;
  const requireAgree: boolean = personalInfoTerm && sensualTerm && serviceTerm;
  return (
    <View style={styles.container}>
      <GPTHeader onPressBackButton={onPressBackButton} />
      <View style={styles.descriptionContainer}>
        <Text style={styles.nameTextBase}>
          <GPTText style={{ color: color.theme0 }}>{userName}</GPTText>
          <GPTText>님</GPTText>
        </Text>
        <Text style={styles.titleTextBase}>
          <GPTText style={{ color: color.theme0 }}>굿팜</GPTText>
          <GPTText> 서비스 가입에 동의해주세요.</GPTText>
        </Text>
        <View style={styles.allAgreeButtonContainer}>
          <TouchableOpacity onPress={setAllAgree} disabled={totalAgree}>
            <View
              style={[
                styles.allAgreeButton,
                {
                  borderColor: totalAgree ? color.white : color.theme4,
                  backgroundColor: totalAgree ? color.theme4 : color.white,
                },
              ]}
            >
              <Image
                source={
                  totalAgree
                    ? require('./images/path-3.png')
                    : require('./images/path-2.png')
                }
                style={styles.allAgreeCheckImage}
              />
              <GPTText
                style={[
                  styles.allAgreeText,
                  {
                    color: totalAgree ? color.white : color.theme4,
                  },
                ]}
                fontWeight={500}
              >
                굿팜의 모든 운영원칙에 동의합니다.
              </GPTText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.agreementsArea}>
          <AgreementButton
            checked={serviceTerm}
            viewTerm={viewServiceTerm}
            checkTerm={toggleServiceTerm}
          >
            [필수] 굿팜 서비스 이용 약관
          </AgreementButton>
          <AgreementButton
            checked={personalInfoTerm}
            viewTerm={viewPersonalInfo}
            checkTerm={togglePersonalInfo}
            right
          >
            [필수] 굿팜 서비스 개인정보 수집 및 이용 동의
          </AgreementButton>
          <AgreementButton
            checked={sensualTerm}
            viewTerm={viewSensualTerm}
            checkTerm={toggleSensualTerm}
          >
            [필수] 굿팜 서비스 민감정보 수집 및 이용 동의
          </AgreementButton>
          <AgreementButton
            checked={personalInfoTerm}
            viewTerm={viewPersonalInfoNotice}
            checkDisable
            right
          >
            [고시] 개인정보처리방침
          </AgreementButton>
        </View>
      </View>
      <View
        style={[
          styles.allowButtonContainer,
          !requireAgree
            ? {
                backgroundColor: color.gray3,
              }
            : { backgroundColor: color.theme0 },
        ]}
      >
        <TouchableOpacity
          onPress={_navigateToComplete}
          disabled={!requireAgree}
        >
          <View style={styles.allowButton}>
            <GPTText
              style={[
                styles.allowButtonText,
                !requireAgree
                  ? { color: color.blueGrey }
                  : { color: color.white },
              ]}
            >
              확인
            </GPTText>
          </View>
        </TouchableOpacity>
      </View>

      <WebViewModal
        flag={flag}
        visible={modalVisible}
        setVisible={setModalVisible}
        resetTimer={resetTimer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: { flex: 1, width: '100%' },
  titleTextBase: {
    fontSize: 44,
    color: color.gray,
    lineHeight: 62,
    marginTop: 28,
    marginLeft: 40,
  },
  nameTextBase: {
    fontSize: 44,
    color: color.gray,
    lineHeight: 51,
    marginTop: 95,
    marginLeft: 40,
  },
  allAgreeButtonContainer: {
    flexDirection: 'row',
    marginTop: 90,
    alignItems: 'center',
  },
  allAgreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 42,
    height: 90,
    width: 610,
    justifyContent: 'center',
    borderRadius: 47,
    borderWidth: 2,
  },
  allAgreeCheckImage: {
    width: 22,
    height: 16.3,
  },
  allAgreeText: {
    fontSize: 34,
    lineHeight: 36,
    marginLeft: 18,
  },
  separator: {
    width: Dimensions.get('window').width - 80,
    marginHorizontal: 40,
    marginTop: 50,
    height: 1,
    backgroundColor: color.gray1,
    marginBottom: 24,
  },
  agreementsArea: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  allowButtonContainer: {
    width: '100%',
    height: 100,
  },
  allowButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  allowButtonText: {
    fontSize: 36,
    lineHeight: 50,
    letterSpacing: 2,
  },
});

export default Agreement;
