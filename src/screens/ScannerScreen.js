import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import LoadingIndicator from '../components/LoadingIndicator';
import { theme } from '../styles/theme';
import { getProductByBarcode } from '../services/productService';
import { saveRecentProduct } from '../services/storageService';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'We need camera access to scan barcodes. Please enable it in your settings.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;
    
    setScanned(true);
    setLoading(true);
    
    try {
      const product = await getProductByBarcode(data);
      
      if (product) {
        await saveRecentProduct(product);
        navigation.replace('ProductInfo', { product });
      } else {
        Alert.alert(
          'Product Not Found',
          'We couldn\'t find information for this product in the Finnish food database.',
          [
            { 
              text: 'Try Again', 
              onPress: () => {
                setScanned(false);
                setLoading(false);
              } 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      Alert.alert(
        'Error',
        'Failed to retrieve product information. Please try again.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setScanned(false);
              setLoading(false);
            } 
          }
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  if (hasPermission === null) {
    return <LoadingIndicator />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="camera-off" size={50} color={theme.colors.error} />
        <Text style={styles.permissionText}>Camera access is required to scan barcodes</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={flashMode}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['ean13', 'ean8'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Barcode</Text>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Feather 
                name={flashMode === Camera.Constants.FlashMode.torch ? "zap" : "zap-off"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              {loading && (
                <View style={styles.loadingContainer}>
                  <LoadingIndicator color="white" />
                  <Text style={styles.loadingText}>Fetching product info...</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.instructions}>
              Align the barcode within the frame to scan
            </Text>
            {scanned && !loading && (
              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashButton: {
    padding: 8,
  },
  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 16,
  },
  loadingText: {
    color: 'white',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructions: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  scanAgainButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  scanAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  permissionText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: theme.colors.text,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ScannerScreen;
