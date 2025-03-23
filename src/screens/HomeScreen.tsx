import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, Alert, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/slices/store';
import { setCurrentLocation, setSearchLocation, setLocation } from '../store/slices/locationSlice';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { styled } from 'nativewind';
import { Image } from "react-native";
import { FirebaseService } from '../services/firebaseService';
import { auth } from '../config/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../config/firebase';
const customIcon = require("../../assets/casco.png");
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
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchInput: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 20,
  },
});

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLocation, searchLocation, otherUserLocation } = useSelector((state: RootState) => state.location);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const firebaseService = FirebaseService.getInstance();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Suscribirse a las ubicaciones en tiempo real
        const locationsRef = ref(realtimeDb, 'locations');
        onValue(locationsRef, (snapshot) => {
          const data = snapshot.val();
          dispatch(setLocation(data || {}));
        });
  
        // Actualizar la ubicación del usuario actual
        (async () => {
          try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
  
            if (Platform.OS === 'ios') {
              const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
              if (backgroundStatus.status !== 'granted') {
                Alert.alert(
                  'Limited Location Access',
                  'Background location access not granted. Some features may be limited.',
                  [{ text: 'OK' }]
                );
              }
            }
  
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
  
            const userLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: Date.now()
            };
  
            // Actualizar en Firebase
            const userLocationRef = ref(realtimeDb, `locations/${user.uid}`);
            set(userLocationRef, userLocation);
  
            dispatch(setCurrentLocation(userLocation));
  
            // Centrar el mapa en la ubicación actual
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            }
          } catch (error) {
            setErrorMsg('Error getting location');
            console.error('Location error:', error);
          }
        })();
      }
    });
  
    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      unsubscribe();
      // Eliminar la ubicación del usuario al desconectarse
      if (auth.currentUser) {
        const userLocationRef = ref(realtimeDb, `locations/${auth.currentUser.uid}`);
        remove(userLocationRef);
      }
    };
  }, [dispatch]);

  const initialRegion = currentLocation ? {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <StyledView className="flex-1">
      <StyledView className="absolute top-0 left-0 right-0 z-10 m-2">
        <GooglePlacesAutocomplete
          placeholder="Search for a location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              dispatch(setSearchLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                description: data.description
              }));
            }
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
          }}
          styles={{
            container: {
              flex: 0,
              backgroundColor: 'white',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            textInput: {
              height: 45,
              borderRadius: 8,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              marginBottom: 5,
            },
          }}
        />
      </StyledView>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            description="aaaaa"
            pinColor="blue"
          >
            <Image source={customIcon} style={{ width: 30, height: 30 }} />
          </Marker>
        )}
        {searchLocation && (
          <Marker
            coordinate={{
              latitude: searchLocation.latitude,
              longitude: searchLocation.longitude,
            }}
            title={searchLocation.description || "Search Location"}
            pinColor="green"
          >
            <Image source={customIcon} style={{ width: 30, height: 30 }} />
          </Marker>
        )}
        {otherUserLocation && Object.entries(otherUserLocation).map(([userId, location]) => (
          <Marker
            key={userId}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Other User Location"
            pinColor="purple"
          >
            <Image source={customIcon} style={{ width: 30, height: 30 }} />
          </Marker>
        ))}
      </MapView>
    </StyledView>
  );
};

export default HomeScreen;
