import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError } from '../store/slices/authSlice';
import { auth, signIn, signUp } from '../config/firebase';

const AuthScreen: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector((state: any) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async () => {
    try {
      const userCredential = await signIn(email, password);
      if (userCredential && userCredential.user) {
        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email || ''
        }));
      } else {
        throw new Error('No se pudo obtener las credenciales del usuario');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await signUp(email, password);
      if (userCredential && userCredential.user) {
        dispatch(setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email || ''
        }));
      } else {
        throw new Error('No se pudo obtener las credenciales del usuario');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    dispatch(setError(''));
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={isSignUp ? handleSignUp : handleSignIn}>
        <Text style={styles.buttonText}>
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode}>
        <Text style={styles.toggleText}>
          {isSignUp 
            ? '¿Ya tienes cuenta? Inicia sesión' 
            : '¿No tienes cuenta? Crea una'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});

export default AuthScreen;