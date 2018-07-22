// @flow
import React from 'react';
import ReactNative from 'react-native';

import styles from './styles';
import Item from './Item';
import type { RNInfinityListSliderPropTypes, RNInfinityListSliderState, Event, Element } from './types';

const itemAmountPerScreen = 20;
const borderWidth = 2;
const {
  FlatList,
  View,
} = ReactNative;

const generateArrayBlock = (length: number): Array<number> => new Array(length).fill(0);

class ReactNativeInfinityListSlider extends React.PureComponent<
  RNInfinityListSliderPropTypes,
  RNInfinityListSliderState,
> {
  flatList: ?{
    scrollToOffset: Function,
  } = null;

  static defaultProps = {
    multiplicity: 0.1,
    decimalPlaces: 1,
    arrayLength: 10000,
    shouldMoveSlider: false,
    scrollEnabled: true,
    mainContainerStyle: null,
    itemStyle: null,
    tenthItemStyle: null,
  };

  state = {
    items: generateArrayBlock(this.props.arrayLength),
    width: 0,
    oneItemWidth: 0,
  };

  componentDidUpdate() {
    if (this.props.shouldMoveSlider) {
      this.scrollToElement(this.props.value);
    }
  }

  onLayout = (event: Event) => {
    this.setState({
      width: event.nativeEvent.layout.width,
      oneItemWidth: Math.round(event.nativeEvent.layout.width / itemAmountPerScreen),
    });
    this.init();
  };

  onSliderMoved = (event: Event) => {
    const { oneItemWidth } = this.state;
    const { onValueChange } = this.props;

    const newValue = (event.nativeEvent.contentOffset.x / oneItemWidth).toFixed(1) * this.props.multiplicity;
    onValueChange(parseFloat(parseFloat(newValue).toFixed(this.props.decimalPlaces)));
  };

  init = () => {
    setTimeout(() => this.scrollToElement(this.props.value), 100);
  };

  scrollToElement = (value: number) => this.flatList && this.flatList.scrollToOffset({
    offset: (value * this.state.oneItemWidth) / this.props.multiplicity,
    animated: false,
  });

  renderItem = (element: Element) => (
    <Item
      oneColumnSize={this.state.oneItemWidth}
      borderWidth={borderWidth}
      index={element.index}
      style={this.props.itemStyle}
      tenthItemStyle={this.props.tenthItemStyle}
      length={this.props.arrayLength}
    />
  );

  renderDefaultThumb = () => (
    <View
      style={[
        styles.defaultThumb,
        this.props.thumbStyle ? this.props.thumbStyle : null,
      ]}
    />
  );

  render() {
    const { renderThumb, scrollEnabled, mainContainerStyle } = this.props;
    const { items, width } = this.state;

    return (
      <View
        style={[
          styles.mainContainer,
          mainContainerStyle,
        ]}
        onLayout={this.onLayout}
      >
        {
          width > 0 ?
            <FlatList
              style={{ flex: 1 }}
              ref={(flatList) => {
                this.flatList = flatList;
              }}
              scrollEnabled={scrollEnabled}
              data={items}
              keyboardShouldPersistTaps="always"
              horizontal
              onScrollEndDrag={this.onSliderMoved}
              onScroll={this.onSliderMoved}
              onMomentumScrollBegin={this.onSliderMoved}
              onMomentumScrollEnd={this.onSliderMoved}
              keyExtractor={(element, index) => index.toString()}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}
            /> : null
        }
        {renderThumb ? renderThumb() : this.renderDefaultThumb()}
      </View>
    );
  }
}

export default ReactNativeInfinityListSlider;