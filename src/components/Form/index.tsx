import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { captureScreen } from 'react-native-view-shot'
import { api } from '../../services/api';
import * as FileSystem from 'expo-file-system';

import { FeedbackType } from '../Widget';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../Button';

import { feedbackTypes } from '../../utils/feedbackTypes';

import { ArrowLeft } from 'phosphor-react-native';
import { theme } from '../../theme';
import { styles } from './styles';

interface FormProps {
  feedbackType: FeedbackType;
  onFeedbackReset: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackReset,
  onFeedbackSent
}: FormProps) {
  const [isSendindFeedback, setIsSendindFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];
  
  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8
    })
      .then(uri => setScreenshot(uri))
      .catch(error => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleFeedbackSend() {
    if (isSendindFeedback) {
      return;
    }

    setIsSendindFeedback(true);

    const screenshotBase64 = screenshot &&
      await FileSystem.readAsStringAsync(screenshot, {
        encoding: 'base64'
      });

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        comment,
        screenshot: `data:image/png;base64,${screenshotBase64}`
      });

      onFeedbackSent();
    } catch(error) {
      console.log(error);
      setIsSendindFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackReset}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image
            source={feedbackTypeInfo.image}
            style={styles.image}
          />

          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={setComment}
        value={comment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          screenshot={screenshot}
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
        />

        <Button
          onPress={handleFeedbackSend}
          isLoading={isSendindFeedback}
        />
      </View>
    </View>
  );
}