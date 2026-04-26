import React from 'react'
import {View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenWrapper from '../ScreenWrapper';
import AppText from '../AppText';

function expenses() {
  return (
    <ScreenWrapper>
      <AppText>
        Expenses
      </AppText>
    </ScreenWrapper>
  )
}

export default expenses
