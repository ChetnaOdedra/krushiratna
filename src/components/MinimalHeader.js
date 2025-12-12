import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MinimalHeader = ({
  title,
  onBackPress,
  backgroundColor = '#fff',
  textColor = '#000',
  showBorder = true,
  statusBarColor = '#fff',
  barStyle = 'dark-content',
  showBackButton = true, // <-- added prop
}) => {
  return (
    <View>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor },
          !showBorder && { borderBottomWidth: 0 },
        ]}
      >
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} /> // keeps spacing
        )}

        <Text style={[styles.title, { color: textColor }]}>{title}</Text>

        <View style={styles.rightSpace} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  backButton: {
    width: 30,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  rightSpace: {
    width: 30,
  },
});

export default MinimalHeader;
