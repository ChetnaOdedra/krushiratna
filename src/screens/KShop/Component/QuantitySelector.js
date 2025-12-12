import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} disabled={quantity <= 1}>
        <Icon name="remove" size={22} color={quantity <= 1 ? '#ccc' : '#000'} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease}>
        <Icon name="add" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    height: 36,
  },
  quantity: {
    marginHorizontal: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});
