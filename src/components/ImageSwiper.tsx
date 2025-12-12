import React, { useRef, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions,StatusBar,TouchableOpacity, Modal, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width } = Dimensions.get('window');

interface ImageSwiperProps {
  images: any[];
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showZoom, setShowZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState()
  const [viewerKey, setViewerKey] = useState(0);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedImage(item.url);
                  setViewerKey(prev => prev + 1);
                  setShowZoom(true);
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View>

      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <Modal 
          visible={showZoom} 
          transparent={false}   // <-- IMPORTANT: remove default black overlay
        >
          <>

          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: '#000' }]}
              onPress={() => setShowZoom(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

           <ImageViewer
                key={viewerKey}
                imageUrls={images.map(img => ({ url: img.url }))}
                index={images.findIndex(x => x.url === selectedImage)}
                enableSwipeDown
                onSwipeDown={() => setShowZoom(false)}
                backgroundColor="#ffffff"
                saveToLocalByLongPress={false}

                renderIndicator={(currentIndex, allSize) => (
                  <Text
                    style={{
                      position: "absolute",
                      top: 40,
                      alignSelf: "center",
                      color: "#000",
                      fontSize: 18,
                      fontWeight: "bold"
                    }}
                  >
                    {currentIndex}/{images.length}
                  </Text>
                )}

                renderImage={(props) => (
                  <Image
                    {...props}
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
                  />
                )}
              />


          </View>

          </>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    height: 200,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  imageWrapper: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    height: 4,
    width: 20,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#1B5E20',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ImageSwiper;
