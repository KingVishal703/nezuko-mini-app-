const firebaseConfig = {
  apiKey: "AIzaSyDkdYO6sQvlLu7WRN3zfSLrzGpSzkUl0lg",
  authDomain: "nezuko-earning.firebaseapp.com",
  databaseURL: "https://nezuko-earning-default-rtdb.firebaseio.com",
  projectId: "nezuko-earning",
  storageBucket: "nezuko-earning.firebasestorage.app",
  messagingSenderId: "941091730977",
  appId: "1:941091730977:web:931e928cacac8eada49560"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
