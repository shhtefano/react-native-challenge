import { forwardRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <EvilIcons
            name="user"
            size={25}
            color="gray"
            style={[
              styles.headerRight,
              {
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          />
          //<EvilIcons name="user" size={24} color="black" />
        )}
      </Pressable>
    );
  }
);

HeaderButton.displayName = 'HeaderButton';

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
