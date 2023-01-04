import React,{Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "flag-icon-css/css/flag-icons.min.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-quill/dist/quill.snow.css';
import App from './App';
import "./styles.scss"
import i18next from "i18next";
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend"
import {Provider} from "react-redux"
import {ClipLoader} from "react-spinners"
import {QueryClientProvider,QueryClient} from "@tanstack/react-query"


import {store,persistor }from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';


i18next.use(initReactI18next).use(LanguageDetector).use(HttpApi).init({
    detection:{
      order:[ 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      caches:['cookie']
    },
    backend:{
      loadPath:`/assets/locales/{{lng}}/translation.json`
    }
})

const client=new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <Suspense fallback={<ClipLoader size={150}/>}>
    <Provider  store={store}>
      
      <PersistGate  persistor={persistor}>
      <QueryClientProvider client={client}>
      <App />
      </QueryClientProvider>
      </PersistGate>
      
    
    </Provider>
    </Suspense>
    

);

