import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/app';

// (Optional) Verify connection
firebase.app(); // This will initialize the app
console.log("✅ Firebase connected:", firebase.app().name);

export { firestore };