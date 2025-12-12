import React from 'react'
import Fonts from '../Util/Fonts'
import { StyleSheet, Text,View } from 'react-native';


export default ComTag = (props) => {
    const {lable,bgColor} = props
    return(
    <View style={{alignSelf: 'flex-start', backgroundColor: bgColor,borderRadius:5}}>
        <Text style={styles.TagText}>{lable}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
     TagText:{
        ...Fonts.FontStyle.TextTagB12px,
        color:'white',
        margin:3,
        marginLeft:10,
        marginRight:10,
     }
})