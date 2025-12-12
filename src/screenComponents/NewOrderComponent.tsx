import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Api from "../Services/Api";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import showToast from "./showToast";

interface Item {
  id: string;
  name: string;
  weight: number;
  seed: string;
  photos: string[];
}

const NewOrderComponent = ({ onActionCompleted }) => {
  const { t } = useTranslation();
  const api = Api.create();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const navigation = useNavigation<any>();

  const getTodaysOrder = async () => {
    setLoading(true);
    try {
      const response = await api.companyTodaysOrders();
      console.log("getTodaysOrder Response:", response);
      setData(response.data.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysOrder();
  }, []);

  function AcceptTapped(item) {
    console.log("Accept Tapped", item);
    navigation.navigate("SubmitProductPrice", {
      item,
      onGoBack: () => {
        if (onActionCompleted) onActionCompleted();
      },
    });
  }

  function RejectTapped(item) {
    setLoading(true);
    api
      .RejectOrder(item)
      .then((response) => {
        console.log("RejectOrder", response);
        showToast(t("Order rejected successfully!"));
        if (onActionCompleted) onActionCompleted();
      })
      .catch((error) => {
        console.log("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.product_name || ""}</Text>
      <View style={styles.divider} />
      <Text style={styles.details}>
        {`${t("Weight")} - ${item.approx_weight} ${item.weight.name}`}
      </Text>
      <Text style={styles.details} numberOfLines={1} ellipsizeMode="tail">
        {`${t("Seed")} - ${item.seed}`}
      </Text>
      <Text style={styles.details}>{t("Photos")}</Text>
      <View style={styles.photoContainer}>
        {item.images.map((photo, index) => (
          <Image key={index} source={{ uri: photo.url }} style={styles.photo} />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => AcceptTapped(item)}
        >
          <Text style={styles.buttonText}>{t("Accept")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => RejectTapped(item)}
        >
          <Text style={styles.buttonText}>{t("Reject")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : data.length === 0 ? (
        <View style={styles.noDataContainer}>
          <FontAwesome5 name="database" size={50} color="#888" />
          <Text style={styles.noDataText}>
            {t("No orders yet! Please check back later.")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    width: "100%",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "green",
    marginVertical: 5,
  },
  details: {
    fontSize: 14,
    color: "gray",
    marginVertical: 2,
  },
  photoContainer: {
    flexDirection: "row",
    marginVertical: 5,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  photo: {
    width: 50,
    height: 50,
    margin: 4,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    marginTop: 10,
    fontSize: 18,
    color: "#888",
  },
});

export default NewOrderComponent;
