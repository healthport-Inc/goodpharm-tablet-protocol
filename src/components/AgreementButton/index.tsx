import React from 'react';
import GPTText from '../GPTText';
import {TouchableOpacity, Image, View, StyleSheet} from 'react-native';
import color from '../../utils/color';

interface Props {
  checked: boolean;
  right?: boolean;
  checkDisable?: boolean;
  viewTerm: () => void;
  checkTerm?: () => void;
}

interface States {}

class AgreementButton extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      checked,
      checkTerm,
      viewTerm,
      right,
      children,
      checkDisable,
    } = this.props;
    return (
      <View style={styles.Container}>
        {checkDisable ? (
          <View style={styles.image} />
        ) : (
          <Image
            source={
              checked
                ? require('./images/path-2.png')
                : require('./images/path-1.png')
            }
            style={styles.image}
          />
        )}
        <TouchableOpacity
          style={styles.flex}
          onPress={() => {
            checkTerm && checkTerm();
          }}
          disabled={checkTerm === undefined}>
          <GPTText style={[styles.flex, styles.text]} fontWeight={200}>
            {children}
          </GPTText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            viewTerm();
          }}>
          <GPTText
            style={[styles.textButton, right ? styles.rightRow : {}]}
            fontWeight={200}>
            보기
          </GPTText>
        </TouchableOpacity>
      </View>
    );
  };
}

export default AgreementButton;

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 12,
    height: 9,
    marginRight: 16,
    marginLeft: 45,
  },
  flex: {flex: 1},
  text: {
    fontSize: 16,
    color: color.black,
  },
  textButton: {
    fontSize: 16,
    borderBottomWidth: 1,
    color: color.gray2,
    borderBottomColor: color.gray2,
    marginRight: 5,
  },
  rightRow: {
    marginRight: 49,
  },
});
