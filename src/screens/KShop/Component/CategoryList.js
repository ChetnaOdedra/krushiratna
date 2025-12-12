import React, { useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import IMAGES from '../../../Util/Images';
import COLORS from '../../../Util/Colors';

const CompaniesList = ({ companies, onCompanyPress, onAllPress }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const handleCompanyPress = (item) => {
    setSelectedCompanyId(item.id);
    onCompanyPress?.(item);
  };

  const handleAllPress = () => {
    setSelectedCompanyId(null); // Deselect when "All" is pressed
    onAllPress?.();
  };

  const renderCompany = ({ item }) => {
    const isSelected = item.id === selectedCompanyId;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleCompanyPress(item)}
      >
        <View style={styles.category}>
          <Image source={{ uri: item.img }} style={styles.image} />
          <Text style={[styles.text, isSelected && styles.selectedText]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFixedItem = () => (
    <TouchableOpacity
      style={[styles.item, selectedCompanyId === null && styles.selectedItem]}
      onPress={handleAllPress}
    >
      <View style={styles.category}>
        {/* <Image
          source={IMAGES.all}
          style={styles.image}
        /> */}
        <View style={[styles.image,{alignItems:'center',justifyContent:'center'}]}>
          <Text style={[styles.textAll]}>All</Text>
        </View>
        {/* <Text style={[styles.text, selectedCompanyId === null && styles.selectedText]}></Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={companies}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={renderCompany}
      ListHeaderComponent={renderFixedItem}
    />
  );
};

export default CompaniesList;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    marginTop: 16,
    marginHorizontal: 16,
    height: 110,
  },
  category: {
    alignItems: 'center',
    // marginRight: 16,
    // marginVertical: 6,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: '#F2F3F4',
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
    textAlign:"center"
  },
  textAll: {
    fontSize: 14,
    color: '#333',
    textAlign:"center",
    fontWeight:700,
    justifyContent:'center'
  },
  item: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    width:ms(70)
  },
  selectedItem: {
    // backgroundColor: '#999797',
    // borderWidth:2,
    // borderColor:COLORS.newbuttonColor,
    width:ms(70),
    backgroundColor: '#F2F3F4',
   transform: [{ scale: 1.03 }], // default size
  },
  selectedText: {
    // fontWeight: 'bold',
    color: '#000000ff',
  },
});
