import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { View, XStack, XStackProps } from 'tamagui';
import { MediumText, SemiBoldText } from '../text/text';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { FlatList, LayoutChangeEvent } from 'react-native';

export type SegmentItem = {
  placeholder?: string;
  label: string;
  value: string;
};

const padding = 4;

export const Segment = memo(
  ({
    value,
    items,
    disabled,
    onChange,
    ...xStackProps
  }: XStackProps & {
    value: string;
    items: SegmentItem[];
    onChange: (value: string) => void;
  }) => {
    const flatListRef = useRef<FlatList>(null);

    const [width, setWidth] = useState<number>();
    const [activeIndex, setActiveIndex] = useState(
      Math.max(items.findIndex((item) => value === item.value)),
    );

    const scrollToIndex = useCallback((index: number) => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }, []);

    const renderItem = useCallback(
      ({ item, index }: { item: SegmentItem; index: number }) => (
        <View
          key={item.value}
          padding="$2"
          borderRadius={50}
          gap="$1"
          minWidth={width ? (width - padding * 2) / items.length : undefined}
          alignItems="center"
          cursor={disabled ? 'auto' : 'pointer'}
          disabled={disabled}
          backgroundColor={value === item.value ? '$color' : 'transparent'}
          onPress={() => {
            emitHaptic();
            onChange(item.value);
            setActiveIndex(index);
          }}
        >
          {!!item.placeholder && (
            <MediumText
              color="$placeholderColor"
              textAlign="center"
              flex={1}
              numberOfLines={1}
            >
              {item.placeholder}
            </MediumText>
          )}
          <SemiBoldText
            textAlign="center"
            numberOfLines={1}
            flex={1}
            color={value === item.value ? '$background' : '$color'}
          >
            {item.label}
          </SemiBoldText>
        </View>
      ),
      [disabled, items.length, onChange, value, width],
    );

    const onLayout = useCallback((e: LayoutChangeEvent) => {
      setWidth(e.nativeEvent.layout.width);
    }, []);

    useEffect(() => {
      if (flatListRef.current) {
        scrollToIndex(activeIndex);
      }
    }, [activeIndex, scrollToIndex]);

    return (
      <XStack
        gap="$1"
        width="100%"
        maxWidth="100%"
        borderRadius={50}
        backgroundColor="$background"
        overflow="hidden"
        disabled={disabled}
        disabledStyle={{ opacity: 0.8 }}
        onLayout={onLayout}
        {...xStackProps}
      >
        <FlatList
          horizontal
          ref={flatListRef}
          data={items}
          renderItem={renderItem}
          onScrollToIndexFailed={(info) =>
            setTimeout(() => scrollToIndex(info.index), 100)
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding }}
        />
      </XStack>
    );
  },
);
