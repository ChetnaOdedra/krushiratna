import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import UesrMob from '../Services/Mobxstate/UesrMob';
import BuyerCustomHeader from '../screenComponents/BuyerCustomHeader';
import CustomHeader from '../screenComponents/CustomHeader';
import HeaderSwitcher from '../screenComponents/HeaderSwitcher';
import MinimalHeader from '../components/MinimalHeader';
import { t } from 'i18next';

type NewsDetailProps = {
  route: RouteProp<
    {
      params: {
        title: string;
        text: string;
        image?: string;
      };
    },
    'params'
  >;
};

const NewsDetailScreen = ({ route,navigation }: NewsDetailProps) => {
  const { title, text, image } = route.params;

  return (
    <View style={{ flex: 1 }}>
    <MinimalHeader title={t('સમાચાર')} onBackPress={() => navigation.goBack()} />
    <ScrollView style={styles.container}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}
   <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </ScrollView>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});

export default NewsDetailScreen;
