import { Text, View } from 'react-native';
import { useAppScheme } from '@symbiot-core-apps/state';

// fixme colorize
export const HeaderTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const { scheme } = useAppScheme();

  const titleColor = scheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={{ gap: 2 }}>
      <Text
        numberOfLines={subtitle ? 1 : 2}
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 600,
          color: titleColor,
        }}
      >
        {title}
      </Text>

      {!!subtitle && (
        <Text
          numberOfLines={1}
          style={{ textAlign: 'center', fontSize: 12, color: '#999999' }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
