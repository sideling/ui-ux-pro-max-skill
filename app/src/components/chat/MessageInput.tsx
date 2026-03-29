import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, TextInput, Text, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts, TypeScale } from '../../constants/typography';
import { Spacing, Radius, MIN_TOUCH } from '../../constants/layout';
import { useChatStore, COOLDOWN_MS_EXPORT } from '../../stores/chatStore';
import { useSendMessage } from '../../hooks/useVote';

interface MessageInputProps {
  matchId: string;
}

export function MessageInput({ matchId }: MessageInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const { canSend, cooldownRemaining, replyTarget, clearReplyTarget } = useChatStore();
  const { mutate: send, isPending } = useSendMessage(matchId);

  // Cooldown progress: 0 = ready, 1 = just sent
  const progress = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCooldownAnimation() {
    progress.value = 1;
    progress.value = withTiming(0, { duration: COOLDOWN_MS_EXPORT });
  }

  const progressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [100, 0])}%`,
  }));

  function handleSend() {
    if (!text.trim() || !canSend() || isPending) return;
    send(text.trim(), {
      onSuccess: () => {
        setText('');
        startCooldownAnimation();
      },
    });
  }

  const isReady = canSend() && text.trim().length > 0 && !isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing[3] }]}>
        {/* Reply indicator */}
        {replyTarget && (
          <View style={styles.replyBar}>
            <Ionicons name="return-down-forward" size={13} color={Colors.accent} />
            <Text style={styles.replyBarText} numberOfLines={1}>
              Replying to <Text style={styles.replyBarName}>{replyTarget.username}</Text>
              {': '}{replyTarget.body}
            </Text>
            <Pressable onPress={clearReplyTarget} hitSlop={8}>
              <Ionicons name="close" size={16} color={Colors.foregroundMuted} />
            </Pressable>
          </View>
        )}

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Say something..."
            placeholderTextColor={Colors.foregroundSubtle}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!isReady}
            style={[styles.sendBtn, isReady && styles.sendBtnActive]}
            hitSlop={8}
          >
            <Ionicons
              name="send"
              size={18}
              color={isReady ? Colors.onAccent : Colors.foregroundSubtle}
            />
          </Pressable>
        </View>

        {/* Cooldown progress bar */}
        <View style={styles.cooldownTrack}>
          <Animated.View style={[styles.cooldownBar, progressStyle]} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    gap: Spacing[2],
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.sm,
    padding: Spacing[2],
  },
  replyBarText: {
    flex: 1,
    fontFamily: Fonts.ui,
    fontSize: TypeScale.xs,
    color: Colors.foregroundMuted,
  },
  replyBarName: {
    color: Colors.accent,
    fontFamily: Fonts.uiMedium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing[2],
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    minHeight: MIN_TOUCH,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.ui,
    fontSize: TypeScale.base,
    color: Colors.foreground,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  cooldownTrack: {
    height: 2,
    backgroundColor: Colors.surface,
    borderRadius: 1,
    overflow: 'hidden',
  },
  cooldownBar: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
});
