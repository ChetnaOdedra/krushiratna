import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../screenComponents/CustomHeader";
import Api from "../Services/Api";
import COLORS from "../Util/Colors";
import UesrMob from "../Services/Mobxstate/UesrMob";
import HeaderSwitcher from "../screenComponents/HeaderSwitcher";

const HomeScreen = (props) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = Api.create();

  const getCategories = async () => {
    try {
      const response = await api.getCategory();
      setLoading(false);
      if (response?.ok && response.data?.data) {
        setCategories(response.data.data);
      } else {
        console.error("API Error:", response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubcategoryPress = (subItem) => {
    props.navigation.navigate("PriceingScreen", subItem);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // Pressable + animation for tap feedback and scroll-safe navigation
  const AnimatedSubcategoryCard = ({ subItem }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = () => {
      handleSubcategoryPress(subItem);
    };

    return (
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={handlePress}>
        <Animated.View style={[styles.itemCard, { transform: [{ scale }] }]}>
          {subItem.img ? (
            <Image source={{ uri: subItem.img }} style={styles.cardImage} resizeMode='cover' />
          ) : (
            <Text style={styles.noImageText}>{t('No Image')}</Text>
          )}
          <Text style={[styles.cardText,{marginTop:2}]}>{subItem.name}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* <HeaderSwitcher /> */}
      <CustomHeader name="Rajesh Patel" role="Farmer" />
      <Text style={styles.title}>{t("dashboard_title")}</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          if (!Array.isArray(item.subcategories) || item.subcategories.length === 0) {
            return <View />;
          }

          return (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{item.name}</Text>
              <FlatList
                data={item.subcategories}
                keyExtractor={(subItem) => subItem.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: subItem }) => (
                  <AnimatedSubcategoryCard subItem={subItem} />
                )}
              />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.newBGcolor,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "700",
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
  },
  itemCard: {
    width: 100,
    backgroundColor:'#f5f5f5',
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    paddingBottom: 10,
    marginVertical: 5,
  },
  cardImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  noImageText: {
    width: "100%",
    height: 100,
    textAlign: "center",
    textAlignVertical: "center",
    color: "gray",
    fontSize: 12,
  },
  cardText: {
    fontSize: 14,
    marginTop: 0,
    textAlign: "center",
    paddingHorizontal: 5,
    color: "#000000ff",
    textAlignVertical: "center",
    flex:1,
    width: '100%',
    bottom: -2,
    
  },
});
