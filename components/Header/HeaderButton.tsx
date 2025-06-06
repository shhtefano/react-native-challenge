import { forwardRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <Feather
            name="user"
            size={20}
            color="white"
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
