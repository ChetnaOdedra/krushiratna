//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Fonts from '../Util/Fonts';

// create a component
const ComTab = (props) => {
     const {name,selected} = props
    return (
        <TouchableOpacity {...props}>
            <View style={styles.container}>
                <Text style={[styles.TextStyle,{fontWeight: name == selected  ? '600' : '400'}]}>{name}</Text>
                <View style={{height:5,width:'70%',backgroundColor:'black',position:'absolute',bottom:5,borderRadius:10,display:name == selected ? 'flex' : 'none'}}></View>
            </View>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:90,
    },
    TextStyle:{
      ...Fonts.FontStyle.TabMain16,  
    }
});

//make this component available to the app
export default ComTab;
