import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import COLORS from '../Util/Colors'
import Fonts from '../Util/Fonts'
import { t } from 'i18next'

const ComButton = (props) => {
    const { title, CustomeStyle, disabled: externalDisabled, textColor, onPress } = props
    const { height } = CustomeStyle || {}
    const [internalDisabled, setInternalDisabled] = useState(false)

    const handlePress = (e) => {
        if (onPress) {
            onPress(e)
        }
        setInternalDisabled(true)
        setTimeout(() => {
            setInternalDisabled(false)
        }, 3000) // disable for 3 seconds
    }

    const isDisabled = internalDisabled || externalDisabled

    return (
        <TouchableOpacity
            style={[
                styles.combtn,
                CustomeStyle,
                isDisabled && styles.btnDisabled
            ]}
            onPress={handlePress}
            disabled={isDisabled}
        >
            <Text style={[
                styles.title,
                { color: textColor === undefined ? COLORS.btnTextcolor : COLORS.grey },
                { lineHeight: height === undefined ? 40 : height }
            ]}>
                {t(title)}
            </Text>
        </TouchableOpacity>
    )
}

export default ComButton

const styles = StyleSheet.create({
    combtn: {
        height: 52,
        backgroundColor: COLORS.newbuttonColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        ...Fonts.FontStyle.SSBtntitle,
        fontWeight: '700',
        color: COLORS.btnTextcolor,
        lineHeight: 40,
    },
    btnDisabled: {
        opacity: 0.7
    }
})
