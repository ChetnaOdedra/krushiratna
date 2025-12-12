import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import CategoryList from '../KShop/Component/CategoryList';
import ProductGrid from '../KShop/Component/ProductGrid';
import SearchBar from '../KShop/Component/SearchBar';
import MinimalHeader from '../../components/MinimalHeader';
import { t } from 'i18next';
import CompaniesList from '../KShop/Component/CategoryList';
import KShopApi from '../../Services/KShopApi';
import debounce from 'lodash.debounce';

const ViewMoreProductsScreen = (props) => {
  const Kapi = KShopApi.create();
  // const [Kcompanies, setKCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const {id,name,companies} = props.route.params.category
  const [categoryID, setcategoryID] = useState(id);

  useEffect(() => {
    console.log("---------")
    console.log(companies)
    onPressAllProduct()
    // GetCompanies();
  }, []);

  const handleCompanyClick = (company) => {
    setProductsLoading(true);
     const params = {
      kshop_category_id:categoryID,
      kshop_company_id:company.id
    };
    console.log(params)
    Kapi.getAllProductswithParams(params).then((response) => {
      setProductsLoading(false);
      if (response.ok) {
        console.log('KShop Products:', response.data);
        setProducts(response.data.data || [])
      } else {
        console.error('Error fetching KShop Products:', response.problem);
      }
    });
  };

  const onPressAllProduct = (company) => {
      setProductsLoading(true);
      Kapi.getAllProducts({ limit: -1, kshop_category_id: categoryID }).then((response) => {
        console.log(response)
        setProductsLoading(false);
        if (response.ok) {
          console.log('KShop Products:', response.data);
          setProducts(response.data.data || [])
        } else {
          console.error('Error fetching KShop Products:', response.problem);
        }
      });
  };
  // API Search Function
  const fetchSearchResults = async (query) => {
    
    if (!query) {
      setSearchResults([]);
      return;
    }
     const params = {
      kshop_category_id:categoryID,
      search:query
    };
    setSearchLoading(true);
    try {
      const response = await Kapi.searchProducts(params); // ✅ You need to create this API in your service
      if (response.ok) {
        setSearchResults(response.data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleSearchChange = (text) => {
    setSearch(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <MinimalHeader title={name} onBackPress={() => props.navigation.goBack()} />
      <SearchBar searchText={search} onChangeText={handleSearchChange} />
      {search.length > 0 ? (
        // ✅ Show search results when typing
        <View style={{ flex: 1, marginTop: 10, marginHorizontal: 16 }}>
          {searchLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={() => props.navigation.navigate('ProductDetailScreen', { product: item })}>
                  <Text style={styles.resultText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !searchLoading && (
                  <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    No results found
                  </Text>
                )
              }
            />
          )}
        </View>
      ) : (
        // ✅ Show original view when search is empty
       <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {Array.isArray(companies) && companies.length > 0 && (
          <CompaniesList
            companies={companies}
            onCompanyPress={handleCompanyClick}
            onAllPress={onPressAllProduct}
          />
        )}
        <Text style={styles.sectionTitle}>{t('Products')}</Text>
        <ProductGrid products={products} loading={productsLoading} />
      </ScrollView>
      )}
    </View>
  );
};

export default ViewMoreProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 10,
    height:30,
  },
  resultItem: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 6,
    marginBottom: 6,
  },
  resultText: {
    fontSize: 16,
  },
});
