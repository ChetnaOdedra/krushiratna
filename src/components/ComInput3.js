import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { ms } from 'react-native-size-matters';
import React from 'react';
import COLORS from '../Util/Colors';
import Fonts from '../Util/Fonts';
import IMAGES from '../Util/Images';

const ComInput3 = (props) => {
  const { lable, password, error, value, editable, Code, lblcolor, ktype } = props;
  const [hidePassword, setHidePassword] = React.useState(password);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: lblcolor || '#4A4A4A' }]}>{lable}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          secureTextEntry={hidePassword}
          autoCorrect={false}
          returnKeyType="done"
          keyboardType={ktype === 'Code' ? 'number-pad' : 'default'}
          onSubmitEditing={() => Keyboard.dismiss()}
          style={[styles.inputText, !editable && styles.readOnlyInput]}
          placeholderTextColor="#999"
          {...props}
        />
        {password && (
          <TouchableOpacity
            style={styles.eyeIconWrapper}
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Image
              style={styles.eyeIcon}
              source={hidePassword ? IMAGES.eye_no : IMAGES.eye}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.errorText, { display: error === '' ? 'none' : 'flex' }]}>{error}</Text>
      ) : null}
    </View>
  );
};

export default ComInput3;

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(12),
  },
  label: {
    ...Fonts.FontStyle.Text14px,
    marginBottom: ms(6),
    paddingLeft: ms(8),
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: COLORS.newLightGray,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: ms(10),
    minHeight: ms(45),
  },
  inputText: {
    fontFamily: Fonts.fontTypes.base,
    flex: 1,
    paddingVertical: ms(10),
    paddingHorizontal: ms(12),
    color: COLORS.black,
  },
  readOnlyInput: {
    color: '#888',
  },
  eyeIconWrapper: {
    padding: ms(5),
  },
  eyeIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: ms(12),
    paddingTop: ms(4),
    paddingLeft: ms(8),
  },
});
