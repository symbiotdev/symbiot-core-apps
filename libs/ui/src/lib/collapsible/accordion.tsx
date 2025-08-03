import { View, XStack } from 'tamagui';
import Collapsible from 'react-native-collapsible';
import { useCallback, useState } from 'react';
import { MediumText, RegularText } from '../text/text';
import { Icon } from '../icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

type AccordionItem = {
  title: string;
  text: string;
};

export const Accordion = ({ items }: { items: AccordionItem[] }) => {
  return items.map((item, index) => (
    <Item key={index} item={item} last={index === items.length - 1} />
  ));
};

const Item = ({ item, last }: { item: AccordionItem; last: boolean }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
    void impactAsync(ImpactFeedbackStyle.Soft);
  }, []);

  return (
    <View borderBottomWidth={last ? 0 : 1} borderBottomColor="$background1">
      <XStack
        cursor="pointer"
        gap="$5"
        justifyContent="space-between"
        padding="$3"
        onPress={toggle}
      >
        <MediumText flex={1} fontSize={20}>
          {item.title}
        </MediumText>

        <Icon name={collapsed ? 'AltArrowDown' : 'AltArrowUp'} />
      </XStack>

      <Collapsible collapsed={collapsed}>
        <View padding="$3">
          <RegularText>{item.text}</RegularText>
        </View>
      </Collapsible>
    </View>
  );
};
