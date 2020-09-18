import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

export interface Props {
  style?: TextStyle | TextStyle[];
  fontWeight?: number;
}

export interface State {}

enum fontWeightDefine {
  ExtraBold,
  Bold,
  Regular,
  light,
}

const calculateFontWeight = (fontWeight?: number): fontWeightDefine => {
  const result: fontWeightDefine =
    fontWeight !== undefined // 디폴트
      ? fontWeight >= 700
        ? fontWeightDefine.ExtraBold
        : fontWeight >= 500
        ? fontWeightDefine.Bold
        : fontWeight >= 300
        ? fontWeightDefine.Regular
        : fontWeight >= 200
        ? fontWeightDefine.light
        : fontWeightDefine.Regular
      : fontWeightDefine.Regular;
  return result;
};

export default class GPText extends React.Component<Props, State> {
  componentDidMount = (): void => {};

  render = (): JSX.Element => {
    const { children, style, fontWeight } = this.props;
    const fontWeightKey: fontWeightDefine = calculateFontWeight(fontWeight);
    return (
      <Text
        style={[
          fontWeightKey === fontWeightDefine.ExtraBold && styles.extrabold,
          fontWeightKey === fontWeightDefine.Bold && styles.bold,
          fontWeightKey === fontWeightDefine.Regular && styles.regular,
          fontWeightKey === fontWeightDefine.light && styles.light,
          style,
        ]}
      >
        {children}
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  extrabold: {
    fontFamily: 'NanumSquareRoundEB',
  },
  bold: {
    fontFamily: 'NanumSquareRoundB',
  },
  regular: {
    fontFamily: 'NanumSquareRoundR',
  },
  light: {
    fontFamily: 'NanumSquareRoundL',
  },
});
