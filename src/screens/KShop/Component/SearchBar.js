import { t } from 'i18next';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchText, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        placeholder={t("Search by product...")}
        value={searchText}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F4',
    borderRadius: 8,
    // padding: 10,
    paddingVertical:4,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    marginLeft:ms(15)
  },
  input: {
    flex: 1,
  },
});
