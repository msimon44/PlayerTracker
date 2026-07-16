import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionIcon}>📷</Text>
                <Text style={styles.permissionTitle}>Accès à la caméra</Text>
                <Text style={styles.permissionSubtitle}>
                    Nous avons besoin de scanner le QR code de votre club pour configurer votre compte.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Autoriser l'accès</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        router.replace({
            pathname: '/(login)/register',
            params: { scannedCode: data },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Overlay sombre avec trou central pour le scan */}
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Text style={styles.scanTitle}>Scanner le Club</Text>
                        <Text style={styles.scanSubtitle}>Placez le QR Code dans le cadre</Text>
                    </View>

                    {/* Cadre de visée (Viseur) */}
                    <View style={styles.viewfinderContainer}>
                        <View style={styles.viewfinder}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(login)/register')}>
                            <Text style={styles.skipText}>
                                Déjà le code organisation ?{'\n'}
                                <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                    Aller directement à l'inscription
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },

    // --- Styles Permission ---
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F5F7FA',
    },
    permissionIcon: { fontSize: 60, marginBottom: 20 },
    permissionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
    permissionSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 30 },
    permissionButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    permissionButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

    // --- Styles Overlay & Viseur ---
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: { marginTop: 40, alignItems: 'center' },
    scanTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    scanSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 },

    viewfinderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    viewfinder: {
        width: 240,
        height: 240,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#4F46E5', // Couleur violette comme tes boutons
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },

    // --- Footer ---
    footer: { marginBottom: 40, width: '100%', alignItems: 'center' },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 20,
    },
    cancelText: { color: '#FFF', fontWeight: '600' },
    skipButton: { padding: 10 },
    skipText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
});
