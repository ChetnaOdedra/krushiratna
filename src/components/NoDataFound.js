import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const NoDataFound = () => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="database" size={50} color="#888" />
      <Text style={styles.text}>No Data Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
  },
});

export default NoDataFound;
