import firebase from "firebase/app";
import "firebase/firestore";
import * as React from "react";
import { renderRoutes } from "react-router-config";

import { AppNavigation } from "./components";

const { useState, useEffect } = React;

if (process.env.BROWSER) {
    // tslint:disable-next-line
    require("./index.scss");
}

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

const useData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    db.collection("structures").limit(100).get().then((querySnapshot) => {
        const list: any = [];
        querySnapshot.forEach((doc) => {
            list.push({
              id: doc.id,
              ...doc.data(),
            });
        });
        setData(list);
    });
  }, []);
  return data;
};

export const App = (props: any) => {
    const data = useData();

    return (
        <main className="app">
            <aside className="app-navigation">
                <AppNavigation />
            </aside>
            <section className="app-layout">
                <header className="app-layout-header">
                </header>
                <div className="app-layout-content">
                  {renderRoutes(props.route.routes)}
                  <pre>{JSON.stringify(data, null, 4)}</pre>
                </div>
            </section>
        </main>
    );
};
