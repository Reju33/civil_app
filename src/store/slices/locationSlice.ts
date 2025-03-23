import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RealtimeLocation {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RealtimeLocationState {
  locations: Record<string, RealtimeLocation>;
}

const initialState: RealtimeLocationState = {
  locations: {},
};

const realtimeLocationSlice = createSlice({
  name: 'realtimeLocation',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<RealtimeLocation>) => {
      state.locations[action.payload.userId] = action.payload;
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      delete state.locations[action.payload];
    },
  },
});

export const { setLocation, removeLocation } = realtimeLocationSlice.actions;
export default realtimeLocationSlice.reducer;
