import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  } | null;
  searchLocation: {
    latitude: number;
    longitude: number;
    description: string;
  } | null;
  otherUserLocation: Record<string, {
    latitude: number;
    longitude: number;
  }>;
}

const initialState: LocationState = {
  currentLocation: null,
  searchLocation: null,
  otherUserLocation: {},
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.currentLocation = {
        ...action.payload,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
    },
    setSearchLocation: (state, action: PayloadAction<{ latitude: number; longitude: number; description: string }>) => {
      state.searchLocation = action.payload;
    },
    setLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.currentLocation = {
        ...action.payload,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };
    },
    setOtherUserLocation: (state, action: PayloadAction<Record<string, { latitude: number; longitude: number }>>) => {
      state.otherUserLocation = action.payload;
    },
  },
});

export const { setCurrentLocation, setSearchLocation, setLocation, setOtherUserLocation } = locationSlice.actions;
export default locationSlice.reducer;
