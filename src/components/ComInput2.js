import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,Keyboard} from 'react-native'
import {s, ms} from 'react-native-size-matters';
import React from 'react'
import COLORS from '../Util/Colors'
import Fonts from '../Util/Fonts'
import IMAGES from '../Util/Images';
const ComInput2 = (props) => {
const {lable,password,error,value,editable,Code,lblcolor,ktype} = props
const [hidePassword,sethidePassword] = React.useState(password)
  return (
    <View style={styles.container}>
      <Text style={[styles.label]}>{lable}</Text>
       <View style={styles.inputStyle}>
          {!value &&
              <TextInput
              secureTextEntry={hidePassword}
              autoCorrect={false}
              returnKeyType="done"
              keyboardType = {ktype === 'Code' ? 'number-pad' : 'default'}
              onSubmitEditing={()=>{Keyboard.dismiss()}}
              onFocus={() => {
              }}
              multiline
              style={styles.inputText}
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
            style={styles.inputText}
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

export default ComInput2
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
      borderColor:COLORS.borderColor,
      borderWidth:ms(1),
      borderRadius:ms(5),
      height:'80%',
      marginTop:ms(5),
      padding:ms(5)
    },
    placeholderTextColor:{
      color:'black'
    },
    inputText:{
      fontFamily: Fonts.fontTypes.base,
      height:'100%',
      textAlignVertical: 'top',
      textAlign:'center'
      
    },
    container:{
      marginHorizontal:ms(5)
    },
    label:{
        ...Fonts.FontStyle.Text14px,
        color:'#4A4A4A',
        justifyContent:'center',
     }
})