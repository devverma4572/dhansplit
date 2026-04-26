import React from 'react'
import {View, Text, StyleSheet} from 'react-native';
import Typo from './Typo';
import { HeaderProps } from '../../../types/types';

const Header = ({title = "", leftIcon, style}: HeaderProps) =>{
  return (
<View style={[styles.container, style]}>
  {leftIcon && (
    <View style={styles.leftIcon}>
      {typeof leftIcon === "string" ? (
        <Text>{leftIcon}</Text>
      ) : (
        leftIcon
      )}
    </View>
  )}

  {title ? (
    <Typo
      size={22}
      fontWeight="600"
      style={{
        textAlign: "center",
        width: leftIcon ? "82%" : "100%",
      }}
    >
      {title},
    </Typo>
  ) : null}
</View>
  )  
}

export default Header

const styles = StyleSheet.create({
  container:{},
  leftIcon:{},
})