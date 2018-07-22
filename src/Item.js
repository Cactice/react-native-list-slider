// @flow
import React from 'react';
import ReactNative from 'react-native';

import styles from './styles';

type ItemPropTypes = {
  oneColumnSize: number,
  borderWidth: number,
  index: number,
  style?: Object,
  tenthItemStyle?: Object,
};

const {
  View,
} = ReactNative;

class Item extends React.PureComponent<ItemPropTypes> {
  static defaultProps = {
    style: null,
    tenthItemStyle: null,
  };

  render() {
    const { oneColumnSize, borderWidth, index, style, tenthItemStyle, length} = this.props;

    return (
      <View
        style={[
          styles.subBlock,
          { width: oneColumnSize, borderRightWidth: borderWidth },
          (index + 1) % 5 === 0 ? { borderRightWidth: borderWidth + 1, height: 50 } : null,
          style,
          (index + 1) % 5 === 0 ? tenthItemStyle : null,
          index === length-1 ? { borderRightWidth: borderWidth + 1, marginLeft: -borderWidth*2, height: 50 } : null
        ]}
      />
    );
  }
}

export default Item;
