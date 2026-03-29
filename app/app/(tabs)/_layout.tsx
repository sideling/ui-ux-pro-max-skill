import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Fonts, TypeScale } from '../../src/constants/typography';
import { TAB_BAR_HEIGHT } from '../../src/constants/layout';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
};

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? Colors.accent : Colors.foregroundSubtle}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
        ],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'football' : 'football-outline'} focused={focused} label="Matches" />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'trophy' : 'trophy-outline'} focused={focused} label="Rankings" />
          ),
        }}
      />
      <Tabs.Screen
        name="ladder"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'podium' : 'podium-outline'} focused={focused} label="Ladder" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bgElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    height: TAB_BAR_HEIGHT,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundSubtle,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.accent,
    fontFamily: Fonts.uiMedium,
  },
});
