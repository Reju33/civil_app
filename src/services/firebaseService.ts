import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../config/firebase';


export class FirebaseService {
  private static instance: FirebaseService;
  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Suscribirse a las ubicaciones de todos los usuarios
  subscribeToLocations(callback: (locations: Record<string, RealtimeLocation>) => void) {
    const locationsRef = ref(realtimeDb, 'locations');
    onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      callback(data || {});
    });
  }

  // Actualizar la ubicación del usuario actual
  updateLocation(userId: string, location: RealtimeLocation) {
    const userLocationRef = ref(realtimeDb, `locations/${userId}`);
    set(userLocationRef, location);
  }

  // Eliminar la ubicación del usuario
  removeLocation(userId: string) {
    const userLocationRef = ref(realtimeDb, `locations/${userId}`);
    remove(userLocationRef);
  }
}