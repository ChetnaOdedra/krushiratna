//import liraries
import React, { Component,useState,useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Fonts from '../Util/Fonts';
import { ms } from 'react-native-size-matters';
import COLORS from '../Util/Colors';
import { t } from 'i18next';
// create a component
const ComDropDown = (props) => {
    const {Title,data} = props
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={styles.container}>
           <View style={{marginHorizontal:10}}>
            <Text style={{color:'#4A4A4A',...Fonts.FontStyle.Text14px,marginBottom:5}}>{t('Title')}</Text>
          <Dropdown
             style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
             placeholderStyle={styles.placeholderStyle}
             selectedTextStyle={styles.selectedTextStyle}
             inputSearchStyle={styles.inputSearchStyle}
             data={props.data == undefined ? [] : data}
             maxHeight={300}
             labelField="label"
             valueField="value"
             placeholder={!isFocus ? 'Select item' : '...'}
             searchPlaceholder="Search..."
             value={value}
             onFocus={() => setIsFocus(true)}
             onBlur={() => setIsFocus(false)}
             onChange={item => {
               setValue(item.value);
               props.Onselect(item.label)
               setIsFocus(false);
             }}/>
          </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height:ms(80),
    },dropdown: {
        height: 50,
        borderRadius:4,
        paddingHorizontal: 25,
        borderWidth:2
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      placeholderStyle: {
        fontSize: 16,
      },
});

//make this component available to the app
export default ComDropDown;
