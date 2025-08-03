import { View, XStack } from 'tamagui';
import Collapsible from 'react-native-collapsible';
import { memo, useCallback, useState } from 'react';
import { MediumText, RegularText } from '../text/text';
import { Icon } from '../icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Card } from '../card/card';

type AccordionItem = {
  title: string;
  text: string;
};

export const Accordion = ({ items }: { items: AccordionItem[] }) => {
  return (
    <Card>
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          first={index === 0}
          last={index === items.length - 1}
        />
      ))}
    </Card>
  );
};

const Item = memo(
  ({
    item,
    first,
    last,
  }: {
    item: AccordionItem;
    first: boolean;
    last: boolean;
  }) => {
    const paddingTop = first ? 0 : '$3';
    const paddingBottom = last ? 0 : '$3';

    const [collapsed, setCollapsed] = useState(true);

    const toggle = useCallback(() => {
      setCollapsed((prev) => !prev);
      void impactAsync(ImpactFeedbackStyle.Soft);
    }, []);

    return (
      <View borderBottomWidth={last ? 0 : 1} borderBottomColor="$background">
        <XStack
          cursor="pointer"
          gap="$5"
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          justifyContent="space-between"
          onPress={toggle}
        >
          <MediumText flex={1} fontSize={20}>
            {item.title}
          </MediumText>

          <Icon name={collapsed ? 'AltArrowDown' : 'AltArrowUp'} />
        </XStack>

        <Collapsible collapsed={collapsed}>
          <RegularText paddingTop={paddingTop} paddingBottom={paddingBottom}>
            {item.text}
          </RegularText>
        </Collapsible>
      </View>
    );
  },
);
