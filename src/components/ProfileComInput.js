import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { s, ms } from 'react-native-size-matters';
import React from 'react';
import COLORS from '../Util/Colors';
import Fonts from '../Util/Fonts';
import IMAGES from '../Util/Images';
import { useTranslation } from 'react-i18next';

const ProfileComInput = (props) => {
  const { t } = useTranslation();
  const {
    lable,
    password,
    error,
    value,
    editable = true,
    Code,
    lblcolor,
    Ktype,
    inputHeight,
    onChangeText,
    placeholder,
  } = props;

  const [hidePassword, sethidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  const borderColor = isFocused ? COLORS.focasInputText : COLORS.borderColor;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: lblcolor }]}>{t(lable)}</Text>
      <View
        style={[
          styles.inputStyle,
          {
            borderColor: borderColor,
            height: inputHeight || ms(50),
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={hidePassword}
          autoCorrect={false}
          keyboardType={Ktype === 'Code' ? 'number-pad' : 'default'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={!!inputHeight && inputHeight > ms(50)}
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={[
            styles.inputText,
            {
              borderColor: borderColor,
              height: inputHeight || '100%',
            },
          ]}
          {...props}
        />

        {password && (
          <View style={styles.hideShowContainer}>
            <TouchableOpacity
              style={styles.hideShowbtn}
              onPress={() => sethidePassword(!hidePassword)}
            >
              <Image
                style={styles.hideShowbtn}
                source={hidePassword ? IMAGES.eye_no : IMAGES.eye}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && (
        <Text
          style={[
            { ...Fonts.FontStyle.SSmallError },
            {
              display: error === '' ? 'none' : 'flex',
              color: 'red',
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default ProfileComInput;

const styles = StyleSheet.create({
  hideShowContainer: {
    position: 'absolute',
    height: '100%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    right: ms(10),
  },
  hideShowbtn: {
    height: ms(24),
    width: ms(24),
  },
  inputStyle: {
    borderWidth: ms(1),
    borderRadius: ms(5),
    marginTop: ms(5),
    justifyContent: 'center',
  },
  inputText: {
    fontFamily: Fonts.fontTypes.base,
    padding: ms(5),
    color: 'black',
    textAlignVertical: 'top',
    marginTop: ms(15),
  },
  container: {
    marginTop: ms(10),
    marginHorizontal: ms(5),
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    ...Fonts.FontStyle.SSinputTitle,
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 1,
    marginLeft: 20,
    top: -5,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
