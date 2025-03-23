import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, Alert, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/slices/store';
import { setCurrentLocation, setSearchLocation, setLocation, setOtherUserLocation } from '../store/slices/locationSlice';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { styled } from 'nativewind';
import { Image } from "react-native";
import { FirebaseService } from '../services/firebaseService';
import { auth } from '../config/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

const customIcon = require("../../assets/casco2.png");
const StyledView = styled(View);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  marker: {
    width: 5,
    height: 5,
  },
});

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { currentLocation, searchLocation, otherUserLocation } = useSelector((state: RootState) => state.location);
  const mapRef = useRef<MapView>(null);
  
  // Estado para el tamaño del marcador
  const [markerSize, setMarkerSize] = useState(25);

  // Función para calcular el tamaño del marcador
  const getMarkerSize = (region: any) => {
    // Tamaño fijo de 15px para todos los marcadores
    return 15;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Suscribirse a las ubicaciones en tiempo real
        const usersRef = ref(realtimeDb, 'userLocations');
        onValue(usersRef, (snapshot) => {
          const locations: Record<string, { latitude: number; longitude: number }> = {};
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data && user.uid !== childSnapshot.key) {
              locations[childSnapshot.key] = {
                latitude: data.latitude,
                longitude: data.longitude
              };
            }
          });
          dispatch(setOtherUserLocation(locations));
        });

        // Actualizar la ubicación del usuario actual
        const updateLocation = async () => {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Error', 'Necesitamos permisos de ubicación');
              return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Actualizar ubicación en Firebase
            const userRef = ref(realtimeDb, `userLocations/${user.uid}`);
            set(userRef, {
              latitude,
              longitude,
              timestamp: Date.now()
            });

            dispatch(setLocation({ latitude, longitude }));

            // Solo centrar el mapa si hay una referencia y una ubicación válida
            if (mapRef.current && currentLocation) {
              const region = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              };
              mapRef.current.animateToRegion(region, 1000);
            }
          } catch (error) {
            console.error('Error updating location:', error);
          }
        };

        // Actualizar ubicación cada 5 segundos
        const interval = setInterval(updateLocation, 5000);

        return () => {
          clearInterval(interval);
          // Limpiar la ubicación del usuario al desconectar
          const userLocationRef = ref(realtimeDb, `userLocations/${user.uid}`);
          remove(userLocationRef);
        };
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Función para obtener la región actual
  const getCurrentRegion = () => {
    if (currentLocation) {
      return currentLocation;
    }
    return initialRegion;
  };

  // Configuración inicial del mapa con deltas
  const initialRegion = {
    latitude: 19.4326, // Ciudad de México
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={getCurrentRegion()}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        showsTraffic
      >
        {/* Marcador del usuario actual */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Mi ubicación 3"
            image={customIcon}
            style={styles.marker}
          />
        )}

        {/* Marcadores de otros usuarios */}
        {otherUserLocation && Object.entries(otherUserLocation).map(([userId, location]) => (
          <Marker
            key={userId}
            coordinate={location}
            title="Otro usuario"
            image={customIcon}
            style={{ width: 15, height: 15 }}
          />
        ))}
      </MapView>
    </View>
  );
};
export default HomeScreen;