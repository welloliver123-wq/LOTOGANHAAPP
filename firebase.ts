import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCaVP_h15VTD-miqg8Y2mWg9RSsd3ZXTqE",
  authDomain: "lotoganha-26c78.firebaseapp.com",
  projectId: "lotoganha-26c78",
  storageBucket: "lotoganha-26c78.firebasestorage.app",
  messagingSenderId: "234729994856",
  appId: "1:234729994856:web:2239c0a74af23c3a4f19dd",
  measurementId: "G-643PRLZK5Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };