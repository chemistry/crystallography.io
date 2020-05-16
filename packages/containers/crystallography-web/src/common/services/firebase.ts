import firebase from "firebase/app";
import "firebase/firestore";
import * as React from "react";
const { useState, useEffect } = React;

const firebaseConfig = {
    apiKey: "AIzaSyDRa3uBbcFFy7K2VSB4Y-C2mpy-M7MaIm4",
     authDomain: "crystallography-api.firebaseapp.com",
     databaseURL: "https://crystallography-api.firebaseio.com",
     projectId: "crystallography-api",
     // storageBucket: "crystallography-api.appspot.com",
     // messagingSenderId: "759047512065",
     appId: "1:759047512065:web:ed998fd7f807490c12a000",
     // measurementId: "G-NLV54MH4T5"
};

export const useFirebase = () => {
  const [isLoaded, setData] = useState(false);

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    return setData(true);
  }, []);
  return isLoaded;
};
