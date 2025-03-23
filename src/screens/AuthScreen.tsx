import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '../store/slices/authSlice';
import { useSelector } from 'react-redux';
import { auth, signIn, signUp } from '../config/firebase';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});
const AuthScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleLogin = async () => {
        try {
          setLoading(true);
          console.log('Intentando login con:', email, password);
          const userCredential = await signIn(auth, email, password);
          console.log('Login exitoso:', userCredential);
          const user = userCredential.user;
          dispatch(setUser({
            uid: user.uid,
            email: user.email || ''
          }));
        } catch (error) {
          console.error('Error detallado:', error);
          dispatch(setError('Error al iniciar sesión'));
        } finally {
          setLoading(false);
        }
      };
      
  
      const handleRegister = async () => {
        try {
          setLoading(true);
          const userCredential = await signUp(auth, email, password);
          const user = userCredential.user;
          dispatch(setUser({
            uid: user.uid,
            email: user.email || ''
          }));
        } catch (error) {
          dispatch(setError('Error al registrarse'));
          console.error('Error register:', error);
        } finally {
          setLoading(false);
        }
      };
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Civil App</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Login'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Register'}</Text>
          </TouchableOpacity>
        </View>
      );
    };
export default AuthScreen;