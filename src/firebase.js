import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCFOSlMS0uCm4weBaQXXvk7ln_1oALfB1k",
  authDomain: "votaciones-dca4a.firebaseapp.com",
  databaseURL: "https://votaciones-dca4a-default-rtdb.firebaseio.com",
  projectId: "votaciones-dca4a",
  storageBucket: "votaciones-dca4a.appspot.com",
  messagingSenderId: "311477821116",
  appId: "1:311477821116:web:93e3becb1eae4ed3abfab9"
})
// const app = firebase.initializeApp({
//   apiKey: "AIzaSyCVgdTvtVxOHcsC6JkppEBeDwR8W98YW0g",
//   authDomain: "beti-fa3da.firebaseapp.com",
//   databaseURL:"https://beti-fa3da-default-rtdb.firebaseio.com/",
//   projectId: "beti-fa3da",
//   storageBucket: "beti-fa3da.appspot.com",
//   messagingSenderId: "675908553852",
//   appId: "1:675908553852:web:0a22e7501355dc4d278df9"
// })

export const auth = firebase.auth();

export default app;