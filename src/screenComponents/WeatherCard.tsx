import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../Services/Api';
import COLORS from '../Util/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IMAGES from '../Util/Images';
import { t } from '../translations/translationHelper';
const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const api = Api.create();

  useEffect(() => {
    api.WeatherInfo()
      .then((response) => {
        console.log('Weather API response:', response);
        if (response.status === 200) {
          setWeather(response.data.data);
        } else {
          console.error('Error fetching weather:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching weather:', error);
      });
  }, []);

  if (!weather) {
    return <Text style={{ textAlign: 'center' }}>Loading weather...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.rowTop}>
          <Text style={styles.dateText}>{weather.date}</Text>
          <Text style={styles.timeText}>{weather.time}</Text>
        </View>

        <View style={styles.weatherRow}>
          <View style={{height:60,width:60,alignItems:'center',justifyContent:'center'}}>
          <Image
            source={IMAGES.wether_card}
            style={styles.weatherIcon}
          />
          </View>
          <View>
            <Text style={styles.tempText}>
              {typeof weather?.temperature === 'number'
                ? `${weather.temperature.toFixed(1)}°C`
                : '--'}
            </Text>
            <Text style={styles.cityText}>{weather.taluka_name}</Text>
            {/* <Text style={styles.cityText}>{weather.description}</Text> */}
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>

          </View>
          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => Linking.openURL(weather.video_link)}
          >
            <Text style={styles.videoText}>{t('Video')}</Text>
            <TouchableOpacity style={{ height: 25, width: 25, marginRight: 5,justifyContent:'center', alignItems: 'center' }}>
              <Image
                source={IMAGES.play_btn}
                style={{ width: 22, height: 22, borderRadius: 50 }}
              />
            </TouchableOpacity>
            {/* <Ionicons name="play-circle-outline" size={25} color="#fff" /> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 0,marginHorizontal: 15, },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  card: {
    backgroundColor: '#1B80EA',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderColor: '#000000',
    borderWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: { color: '#fff', fontSize: 15 },
  timeText: { color: '#fff', fontSize: 15},
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginTop: 15,
  },
  tempText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  cityText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  videoButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    paddingHorizontal: 2,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  
  },
  videoText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
    paddingRight:8,
    paddingLeft:10,

  },
});

export default WeatherCard;
