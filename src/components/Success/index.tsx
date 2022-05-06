import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import successImg from '../../assets/success.png';

import { styles } from './styles';

interface SuccessProps {
  onSendAnotherFeedBack: () => void;
}

export function Success({ onSendAnotherFeedBack }: SuccessProps) {
  return (
    <View style={styles.container}>
      <Image
        source={successImg}
        style={styles.image}
      />
      <Text style={styles.title}>
        Agradecemos o feedback!
      </Text>

      <TouchableOpacity
        onPress={onSendAnotherFeedBack}
        style={styles.button}
      >
        <Text style={styles.buttonTitle}>
          Quero enviar outro
        </Text>
      </TouchableOpacity>
    </View>
  );
}