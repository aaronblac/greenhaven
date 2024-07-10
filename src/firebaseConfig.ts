import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB_Y_Qe3MxkMm6m-RcxldPKbgDpFiYezIA",
    authDomain: "greenhaven-d11b5.firebaseapp.com",
    projectId: "greenhaven-d11b5",
    storageBucket: "greenhaven-d11b5.appspot.com",
    messagingSenderId: "728466169091",
    appId: "1:728466169091:web:327bd557543e774dc1dd36",
    measurementId: "G-0MHY66NPSF"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };