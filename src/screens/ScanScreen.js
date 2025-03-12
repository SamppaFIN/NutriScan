import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { scanBarcode } from '../services/barcodeService';
import { getProductInfo } from '../services/productService';
import { saveScannedProduct } from '../utils/storageUtils';
import colors from '../constants/colors';

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || scanning) return;
    
    setScanned(true);
    setScanning(true);
    
    try {
      // Process barcode data
      const barcodeData = await scanBarcode(data);
      
      // Fetch product information
      const productInfo = await getProductInfo(barcodeData.barcode);
      
      // Save to recently scanned
      await saveScannedProduct(productInfo);
      
      // Navigate to product info screen
      navigation.navigate('ProductInfo', { product: productInfo });
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert(
        'Error',
        'Could not find product information. Please try again or scan another product.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Feather name="camera-off" size={50} color="gray" />
        <Text style={styles.permissionText}>
          Camera access is required to scan product barcodes
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.permissionButtonText}>
            Grant Permission
          </Text>
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
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['ean13', 'ean8'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            {scanning && (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.scanningText}>
                  Looking up product...
                </Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Align barcode within the frame
            </Text>
          </View>

          {scanned && !scanning && (
            <TouchableOpacity 
              style={styles.rescanButton} 
              onPress={resetScanner}
            >
              <Feather name="refresh-cw" size={20} color="white" />
              <Text style={styles.rescanButtonText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#555',
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  instructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  rescanButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
