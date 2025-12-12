import React, { useState } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
const CustomToggle = ({ initial = false, onToggle }) => {
  const [isOn, setIsOn] = useState(initial);
  const translateX = useState(new Animated.Value(initial ? 2 : 32))[0];
  const { t } = useTranslation();
  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    Animated.timing(translateX, {
      toValue: newValue ? 2 : 32,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onToggle) onToggle(newValue);
  };

  return (
    <TouchableOpacity
      style={[styles.toggleContainer, isOn ? styles.on : styles.off]}
      onPress={toggle}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
      <Text style={[styles.label, isOn ? styles.textOn : styles.textOff]}>
        {isOn ? t('ON') : t('OFF')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 60,
    height: 25,
    borderRadius: 30,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    position: 'relative',
  },
  on: {
    backgroundColor: '#4CAF50',
  },
  off: {
    backgroundColor: '#ccc',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 13,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2,
    left: 5,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textOn: {
    color: '#fff',
    marginLeft: 24,
  },
  textOff: {
    color: '#333',
    marginRight: 24,
  },
});

export default CustomToggle;
