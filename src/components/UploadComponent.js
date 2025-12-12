import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';


export default  UploadComponent = ({ title, fileTypes, maxSize }) => {
    const [selectedFile, setSelectedFile] = useState(null);
  
    const pickFile = async () => {
      try {
        const res = await DocumentPicker.pick({
          type: fileTypes,
        });
        if (res.size <= maxSize) {
          setSelectedFile(res);
        } else {
          alert(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled the picker');
        } else {
          console.error(err);
        }
      }
    };
  
    return (
      <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
        {selectedFile ? (
          <Text style={styles.fileText}>{selectedFile.name}</Text>
        ) : (
          <Text style={styles.placeholderText}>Drag and drop your file here or BROWSE</Text>
        )}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    uploadBox: {
      height: 120,
      borderWidth: 2,
      borderColor: '#0099ff',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      borderRadius: 10,
      padding: 10,
    },
    placeholderText: {
      color: '#999',
      textAlign: 'center',
    },
    fileText: {
      color: '#333',
      fontWeight: 'bold',
    },
  });