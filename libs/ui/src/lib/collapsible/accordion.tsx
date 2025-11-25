import { useTheme, View, ViewProps, XStack } from 'tamagui';
import Collapsible from 'react-native-collapsible';
import { ReactElement, useCallback, useState } from 'react';
import { Icon } from '../icons';
import { Card } from '../card/card';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { SemiBoldText } from '../text/text';

type AccordionItem = {
  title: string;
  content: ReactElement;
};

export const Accordion = ({
  items,
  ...viewProps
}: ViewProps & { items: AccordionItem[] }) => {
  return (
    <Card paddingVertical="$2" {...viewProps}>
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

const Item = ({
  item,
  first,
  last,
}: {
  item: AccordionItem;
  first: boolean;
  last: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
    emitHaptic();
  }, []);

  return (
    <View
      borderBottomWidth={last ? 0 : 1}
      // $background as value not woking on light theme
      borderBottomColor={theme?.$background?.val}
    >
      <XStack
        flex={1}
        cursor="pointer"
        gap="$5"
        justifyContent="space-between"
        alignItems="center"
        onPress={toggle}
      >
        <SemiBoldText
          fontSize={18}
          lineHeight={20}
          paddingVertical="$4"
          flex={1}
        >
          {item.title}
        </SemiBoldText>

        <Icon name={collapsed ? 'AltArrowDown' : 'AltArrowUp'} />
      </XStack>

      <Collapsible collapsed={collapsed}>
        <View paddingBottom="$3">{item.content}</View>
      </Collapsible>
    </View>
  );
};
