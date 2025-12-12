import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {s, ms} from 'react-native-size-matters';
import React from 'react'
import COLORS from '../Util/Colors'
import Fonts from '../Util/Fonts'
import IMAGES from '../Util/Images';
import { useTranslation } from 'react-i18next';
const ComInput = (props) => {
  const { t } = useTranslation();
const {lable,password,error,value,editable,Code,lblcolor,Ktype} = props
const [hidePassword,sethidePassword] = React.useState(password)
const [isFocused, setIsFocused] = React.useState(false); // State for focus
const borderColor = isFocused ? COLORS.focasInputText : COLORS.borderColor;
  return (
    <View style={styles.container}>
      <Text style={[styles.label,{color:lblcolor}]}>{t(lable)}</Text>
       <View style={[styles.inputStyle,{borderColor:borderColor}]}>
          {!value &&
              <TextInput
              secureTextEntry={hidePassword}
              autoCorrect={false}
              keyboardType = {Ktype === 'Code' ? 'number-pad' : 'default'}
              onFocus={() => setIsFocused(true)} // Set focus to true
               onBlur={() => setIsFocused(false)} // S
              style={[styles.inputText,{borderColor:borderColor}]}
              {...props}
            />
          }
          {value &&
            <TextInput
            secureTextEntry={hidePassword}
            autoCorrect={false}
            onFocus={() => {
            }}
            value=''
            style={[styles.inputText,{borderColor:borderColor}]}
            {...props}
          />
          }
          {password && 
          (<View style={styles.hideShowContainer}>
               <TouchableOpacity editable={editable} selectTextOnFocus={editable} style={styles.hideShowbtn} onPress={()=> hidePassword ? sethidePassword(false) : sethidePassword(true)}>
                 <Image style={styles.hideShowbtn} source={hidePassword ? IMAGES.eye_no : IMAGES.eye}/>
              </TouchableOpacity>
          </View>)
          }
        </View>
       {error &&
        <Text style={[{...Fonts.FontStyle.SSmallError},{display:error === "" ? 'none' : 'flex',color:'red'}]}>{error}</Text>
       }
       {/* <Text style={[{...Fonts.FontStyle.SSmallError},{display:error === "" ? 'none' : 'flex'}]}>{error}</Text> */}
    </View>
  )
}

export default ComInput
const styles = StyleSheet.create({
    hideShowContainer:{
      position:'absolute',
      height:'100%',
      alignSelf:'flex-end',
      justifyContent:'center',
      alignItems:'center',
      right:ms(10)
   },
    hideShowbtn:{
      height:ms(24),
      width:ms(24),
    },
    inputStyle:{
      borderWidth:ms(1),
      borderRadius:ms(5),
      height:ms(50),
      marginTop:ms(5),
    },
    placeholderTextColor:{
      color:'black'
    },
    inputText:{
      fontFamily: Fonts.fontTypes.base,
      justifyContent:'center',
      height:'100%',
      left:ms(10),
      color: 'black'
    },
    container:{
      marginTop:ms(10),
      marginHorizontal:ms(20),
      backgroundColor:'white'
    },
    label:{
       ...Fonts.FontStyle.SSinputTitle, 
       position:'absolute',
       backgroundColor:'white',
       zIndex:1,
       marginLeft:20,
       top:-5,
       paddingLeft:5,
       paddingRight:5
    }
})