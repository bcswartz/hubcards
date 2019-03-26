import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import moment from 'moment';

import "../node_modules/bulma/css/bulma.css";

// Call for the Firebase configuration file
const fb = require( "./firebaseConfig.js" );

Vue.config.productionTip = false;

// Filters for formatting dates as date and datetime strings.
Vue.filter( 'asDateString', function( value ) {
  return value ? moment( value.toDate() ).format( "MM/DD/YYYY" ) : "N/A";
});

Vue.filter( 'asDatetimeString', function( value ) {
  return value ? moment( value.toDate() ).format( "MM/DD/YYYY hh:mm:ss a" ) : "N/A";
});

/*
 By having Firebase's onAuthStateChange action be responsible for rendering the Vue app,
 you ensure that Firebase is up and ready before the app is loaded or the user refreshes the
 web page via the browser
*/
let app;
fb.auth.onAuthStateChanged( user => {
  if( !app ) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app")
  }
});
