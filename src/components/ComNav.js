//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';
import IMAGES from '../Util/Images';
import { ms } from 'react-native-size-matters';

// create a component
const ComNav = (props) => {
    const {name,back,Drawericon} = props
    return(
        <View style={{height:ms(165),width:'100%',backgroundColor:'white',position:'relative'}}>
          <Image style={{
                 width: '100%', height: '100%', resizeMode: 'stretch',
             }} source={IMAGES.homeback} />
             <View style={{height:ms(70),width:'100%',position:'absolute',top:ms(30)}}>
                 <View style={{flexDirection:'row'}}>
                         <View style={{height:ms(60),width:ms(50),left:5,justifyContent:'center'}}>
                             <TouchableOpacity {...props} style={{display:back == true ? 'flex' : 'none',alignSelf:'center'}}>
                                <Image style={{height:30,width:30, resizeMode:'contain',aspectRatio:3/3}} source={IMAGES.backicon} />
                             </TouchableOpacity>
                         </View>
                         <View style={{height:ms(60),flex:4,flexDirection:'column',justifyContent:'center'}}>
                             <Text style={styles.subTitleSmall}>{name}</Text>
                         </View>
                         <View style={{height:ms(60),flex:1,justifyContent:'center',display:Drawericon == true ? 'flex' : 'none'}}>
                              <TouchableOpacity {...props}>
                                 <Image style={{  resizeMode:'center',aspectRatio:2/3,left:5}} source={IMAGES.sidemenuicon}/>
                              </TouchableOpacity>
                         </View> 
                 </View>
             </View>
         </View>
    )
};

// define your styles
const styles = StyleSheet.create({
    subTitleSmall: {
        fontSize:20,
        width:'90%',
        marginLeft:0,
        fontWeight:'700',
      }  
});

//make this component available to the app
export default ComNav;
