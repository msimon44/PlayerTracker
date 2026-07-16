import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// --- DEFINITION DES TYPES ---

// 1. Interface pour les props de ton composant CustomInput
interface CustomInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string; // Le '?' rend la prop optionnelle
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions; // Restreint aux types valides (email-address, numeric, etc.)
}

// 2. Interface pour l'état du formulaire
interface RegisterFormData {
    nom: string;
    prenom: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    orgCode: string;
}

// --- COMPOSANTS ---

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false, // Valeur par défaut
    keyboardType = 'default', // Valeur par défaut
}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor='#A0A0A0'
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize='none'
        />
    </View>
);

export default function RegisterScreen() {
    // On applique l'interface à l'état initial
    const [formData, setFormData] = useState<RegisterFormData>({
        nom: '',
        prenom: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        orgCode: '',
    });

    const { scannedCode } = useLocalSearchParams<{ scannedCode: string }>(); // 2. Récupère le code scanné
    // 3. Utilise useEffect pour remplir le champ dès que la page s'ouvre avec un code
    useEffect(() => {
        if (scannedCode) {
            setFormData((prev) => ({ ...prev, orgCode: scannedCode }));
        }
    }, [scannedCode]);

    // Fonction générique typée pour mettre à jour le formulaire
    // keyof RegisterFormData assure qu'on ne peut pas passer un champ qui n'existe pas (ex: "age")

    const handleChange = (name: keyof RegisterFormData, text: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: text }));
    };
    const router = useRouter();

    const handleGoToLogin = () => {
        router.replace('/(login)/login');
    };
    const handleRegister = () => {
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        console.log('Données envoyées :', formData);
        Alert.alert('Succès', `Bienvenue ${formData.username} !`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image source={{ uri: 'https://placekitten.com/200/200' }} style={styles.logo} />
                        </View>
                        <Text style={styles.title}>Welcome to PT</Text>
                        <Text style={styles.subtitle}>Créez votre compte pour commencer</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label='Nom'
                            placeholder='Ex: Dupont'
                            value={formData.nom}
                            onChangeText={(text) => handleChange('nom', text)}
                        />

                        <CustomInput
                            label='Prénom'
                            placeholder='Ex: Jean'
                            value={formData.prenom}
                            onChangeText={(text) => handleChange('prenom', text)}
                        />

                        <CustomInput
                            label='Mail'
                            placeholder='exemple@email.com'
                            keyboardType='email-address' // TypeScript validera que c'est une valeur autorisée
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />

                        <CustomInput
                            label='Username'
                            placeholder='Votre pseudo'
                            value={formData.username}
                            onChangeText={(text) => handleChange('username', text)}
                        />

                        <CustomInput
                            label='Mot de passe'
                            placeholder='••••••••'
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => handleChange('password', text)}
                        />

                        <CustomInput
                            label='Confirmer le mot de passe'
                            placeholder='••••••••'
                            secureTextEntry
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleChange('confirmPassword', text)}
                        />

                        <CustomInput
                            label='Code fourni par organisation'
                            placeholder='Ex: ORG-1234'
                            value={formData.orgCode}
                            onChangeText={(text) => handleChange('orgCode', text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Inscription</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkContainer} onPress={handleGoToLogin}>
                            <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
    container: { flex: 1 },
    scrollContainer: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 30 },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    logo: { width: '100%', height: '100%' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
    form: { width: '100%' },
    inputContainer: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginLeft: 4 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    linkText: { color: '#6B7280', fontSize: 14 },
});
