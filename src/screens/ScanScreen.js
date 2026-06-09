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
import { analyzeProductImage } from '../services/visionService';
import { saveScannedProduct } from '../utils/storageUtils';
import colors from '../constants/colors';

export default function ScanScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [mode, setMode] = useState(route?.params?.mode || 'barcode'); // 'barcode' | 'photo'
  const [scanning, setScanning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // ── Barcode mode ──────────────────────────────────────────────

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || scanning || mode !== 'barcode') return;
    
    setScanned(true);
    setScanning(true);
    
    try {
      const barcodeData = await scanBarcode(data);
      const productInfo = await getProductInfo(barcodeData.barcode);
      
      if (!productInfo) {
        Alert.alert(
          'Product not found',
          `Barcode ${barcodeData.barcode} was not found in the database.\n\nYou can add it to Open Food Facts to help improve the database for everyone.`,
          [
            { text: 'Scan Again', onPress: () => setScanned(false) },
            { 
              text: 'Add to Open Food Facts',
              onPress: () => {
                const url = `https://world.openfoodfacts.org/cgi/product.pl?code=${barcodeData.barcode}`;
                try {
                  const { Linking } = require('react-native');
                  Linking.openURL(url);
                } catch (e) { /* fallback */ }
                setScanned(false);
              },
            },
          ]
        );
        return;
      }
      
      await saveScannedProduct(productInfo);
      navigation.navigate('ProductInfo', { product: productInfo });
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert(
        'Scan Error',
        'An error occurred while scanning. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setScanning(false);
    }
  };

  // ── Photo mode ─────────────────────────────────────────────────

  const handleTakePicture = async () => {
    if (!cameraRef.current || analyzing) return;

    setAnalyzing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
        skipProcessing: true,
      });

      if (!photo?.base64) {
        throw new Error('No image data');
      }

      const product = await analyzeProductImage(photo.base64);

      if (!product) {
        Alert.alert(
          'Tuotetta ei tunnistettu',
          'Kuvasta ei pystytty tunnistamaan tuotetta. Kokeile ottaa kuva uudelleen paremmassa valaistuksessa, tai käytä viivakoodiskannausta.',
          [{ text: 'OK' }]
        );
        return;
      }

      await saveScannedProduct(product);
      navigation.navigate('ProductInfo', { product });
    } catch (error) {
      console.error('Photo analysis error:', error);
      Alert.alert(
        'Virhe',
        'Kuvan analysointi epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.',
        [{ text: 'OK' }]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Shared ────────────────────────────────────────────────────

  const resetScanner = () => {
    setScanned(false);
  };

  // ── Permission states ─────────────────────────────────────────

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
          Camera access is required to scan products
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

  // ── Render ────────────────────────────────────────────────────

  const isBarcodeMode = mode === 'barcode';

  return (
    <View style={styles.container}>
      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, isBarcodeMode && styles.modeButtonActive]}
          onPress={() => { setMode('barcode'); setScanned(false); }}
        >
          <Feather
            name="maximize"
            size={16}
            color={isBarcodeMode ? 'white' : colors.primary}
          />
          <Text style={[styles.modeText, isBarcodeMode && styles.modeTextActive]}>
            Barcode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, !isBarcodeMode && styles.modeButtonActive]}
          onPress={() => setMode('photo')}
        >
          <Feather
            name="camera"
            size={16}
            color={!isBarcodeMode ? 'white' : colors.primary}
          />
          <Text style={[styles.modeText, !isBarcodeMode && styles.modeTextActive]}>
            Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera */}
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={
          isBarcodeMode && !scanned ? handleBarCodeScanned : undefined
        }
        barCodeScannerSettings={
          isBarcodeMode ? { barCodeTypes: ['ean13', 'ean8'] } : undefined
        }
      >
        <View style={styles.overlay}>
          {/* Barcode mode: scanner frame */}
          {isBarcodeMode && (
            <>
              <View style={styles.scannerFrame}>
                {scanning && (
                  <View style={styles.scanningIndicator}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.scanningText}>Looking up product...</Text>
                  </View>
                )}
              </View>
              <View style={styles.instructions}>
                <Text style={styles.instructionsText}>
                  Align barcode within the frame
                </Text>
              </View>
              {scanned && !scanning && (
                <TouchableOpacity style={styles.rescanButton} onPress={resetScanner}>
                  <Feather name="refresh-cw" size={20} color="white" />
                  <Text style={styles.rescanButtonText}>Scan Again</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Photo mode: analyzing indicator */}
          {!isBarcodeMode && analyzing && (
            <View style={styles.analyzingOverlay}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.analyzingText}>Analysoimme kuvaa...</Text>
              <Text style={styles.analyzingSubtext}>
                Tunnistamme tuotteen tekoälyn avulla
              </Text>
            </View>
          )}
        </View>
      </Camera>

      {/* Photo mode: capture button (below camera) */}
      {!isBarcodeMode && (
        <View style={styles.photoControls}>
          <Text style={styles.photoHint}>
            Kohdista tuote kameralle ja ota kuva
          </Text>
          <TouchableOpacity
            style={[styles.captureButton, analyzing && styles.captureButtonDisabled]}
            onPress={handleTakePicture}
            disabled={analyzing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      )}
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

  // ── Mode toggle ─────────────────────────────────────────────
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  modeTextActive: {
    color: 'white',
  },

  // ── Camera ──────────────────────────────────────────────────
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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

  // ── Photo mode ──────────────────────────────────────────────
  analyzingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  analyzingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  analyzingSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
  },
  photoControls: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  photoHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 14,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    borderColor: '#ccc',
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
  },
});
