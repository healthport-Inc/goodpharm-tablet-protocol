import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import GPTText from '../GPTText';
import color from '../../utils/color';

type ButtonProps = {
  onPress: () => void;
  imagePath?: ImageSourcePropType;
  number?: string;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
};

const Button = (props: ButtonProps) => {
  const {imagePath, onPress, number, imageStyle, textStyle} = props;
  return (
    <View style={styles.flex}>
      <TouchableOpacity
        style={styles.flex}
        onPress={() => onPress()}
        hitSlop={{top: 10, bottom: 10, left: 40, right: 40}}>
        <View style={styles.buttonArea}>
          {imagePath ? (
            <Image
              style={[styles.image, imageStyle ? imageStyle : {}]}
              source={imagePath}
            />
          ) : (
            <GPTText
              style={[styles.buttonText, textStyle ? textStyle : {}]}
              fontWeight={200}>
              {number}
            </GPTText>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const MemoButton = React.memo(Button);

interface Props {
  setNumber: (number: string) => void;
  resetNumber: () => void;
  backSpace: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

interface States {}

class NumberInput extends React.PureComponent<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      setNumber,
      resetNumber,
      backSpace,
      style,
      imageStyle,
      textStyle,
    } = this.props;
    return (
      <View style={[styles.container, style && style]}>
        <View style={styles.rowSeparate} />
        <View style={styles.row}>
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('1')}
            number="1"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('2')}
            number="2"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('3')}
            number="3"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
        </View>
        <View style={styles.rowSeparate} />
        <View style={styles.row}>
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('4')}
            number="4"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('5')}
            number="5"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('6')}
            number="6"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
        </View>
        <View style={styles.rowSeparate} />
        <View style={styles.row}>
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('7')}
            number="7"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('8')}
            number="8"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('9')}
            number="9"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
        </View>
        <View style={styles.rowSeparate} />
        <View style={styles.row}>
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => resetNumber()}
            imagePath={require('./images/reload.png')}
            imageStyle={imageStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => setNumber('0')}
            number="0"
            textStyle={textStyle}
          />
          <View style={styles.columnSeparate} />
          <MemoButton
            onPress={() => backSpace()}
            imagePath={require('./images/group3.png')}
            imageStyle={imageStyle}
          />
          <View style={styles.columnSeparate} />
        </View>
        <View style={styles.rowSeparate} />
      </View>
    );
  };
}

export default NumberInput;

const styles = StyleSheet.create({
  flex: {flex: 1, alignItems: 'center'},
  container: {
    width: 548,
  },
  rowSeparate: {
    height: 2,
    width: '100%',
    backgroundColor: color.gray11,
  },
  columnSeparate: {
    width: 2,
    height: '100%',
    backgroundColor: color.gray11,
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: color.gray,
    fontSize: 72,
    lineHeight: 80,
  },
  image: {
    width: 62,
    height: 62,
  },
  row: {flex: 1, flexDirection: 'row'},
});
