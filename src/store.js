// Import Vue and the Vuex store
import Vue from 'vue'
import Vuex from 'vuex'

// Call for the Firebase configuration file
const fb = require( "./firebaseConfig.js" );

Vue.use( Vuex );

fb.auth.onAuthStateChanged(user => {
  store.commit( "setDataReady", false );

  if( !store.state.dev ) {
    store.dispatch( "createDevObject" )
  }
  store.state.dev.addLog( "onAuthStateChange invoked" );
  store.state.dev.addData( "user", user );
  if ( user ) {
    // Need a loggedIn flag we can set without waiting for the doc retrieval
    store.commit( "setLoggedIn", true );
    // See if the user has a user document before setting them as the current user
    fb.userCollection.doc( user.uid ).get().then( result => {
      if( result.exists ) {
        store.commit( "setCurrentUser", user );
        store.dispatch( "fetchUserProfile" );
      } else {
        store.state.dev.addLog( "No user document for user " + user.email );
        store.dispatch( "clearData" );
      }
    });
  } else {
    store.commit( "setLoggedIn", false );
  }

  // Retrieve users (need to know if users exist to control certain aspects of the application
  fb.userCollection.orderBy( "lastName", "asc" ).onSnapshot( querySnapshot => {
    let userArray = [];

    querySnapshot.forEach( doc => {
      let userObj = doc.data();
      userObj.id = doc.id; // The unique id of the document is segregated from rest of data retrieved by data()
      userArray.push( userObj );
    });

    store.commit( "setUsers", userArray );

  });

  // Retrieve the card collection
  fb.cardCollection.orderBy( "lastUpdated", "desc" ).onSnapshot( querySnapshot => {

    let cardArray = [];
    let categorySet = new Set().add( "- All -" );
    let colorSet = new Set();

    querySnapshot.forEach( doc => {
      let cardObj = doc.data();
      cardObj.id = doc.id; // The unique id of the document is segregated from rest of data retrieved by data()
      cardArray.push( cardObj );
      categorySet.add( cardObj.category );
      colorSet.add( cardObj.cardBackground );
      colorSet.add( cardObj.cardText );
      colorSet.add( cardObj.contextBackground );
      colorSet.add( cardObj.contextText );
      if( cardArray.length == 1 ) {
        store.commit( "setLastPalette", [ cardObj.cardBackground, cardObj.cardText, cardObj.contextBackground, cardObj.contextText ] );
      }
    });

    store.commit( "setCards", cardArray );
    store.commit( "setCategories", Array.from( categorySet ).sort() );
    store.commit( "setColors", Array.from( colorSet ) );

    // In theory, the problem with this is that this could resolve before our user retrieval finishes, though that is
    // a) unlikely, b) not much of an impact on the UI unless the user is opening the user account route immediately.
    store.commit( "setDataReady", true );

  });


});

export const store = new Vuex.Store({
  state: {
    loggedIn: false,
    dataReady: false,
    currentUser: null,
    userProfile: {},
    cards: [],
    categories: [],
    colors: [],
    lastPalette: {
      cardBackground: "yellow",
      cardText: "black",
      contextBackground: "black",
      contextText:  "white"
    },
    lastNewColor: "",
    users: [],
    incomingCards: [],
    reauthenticate: false,
    showColorModal: false,
    dev: null,
    categoryFilter: null
  },
  mutations: {
    setLoggedIn( state, val ) {
      state.loggedIn = val;
    },
    setDataReady( state, val ) {
      state.dataReady = val;
    },
    setCurrentUser( state, val ) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.dev.addData( "userProfile", val );
      state.userProfile = val;
    },
    setUsers( state, val ) {
      state.users = val;
    },
    setCards( state, val ) {
      state.cards = val;
    },
    setCategories( state, val ) {
      state.categories = val;
    },
    setColors( state, val ) {
      state.colors = val;
    },
    setLastPalette( state, paletteArray ) {
      state.dev.addData( "LastPalette", paletteArray );
      state.lastPalette.cardBackground = paletteArray[0];
      state.lastPalette.cardText = paletteArray[1];
      state.lastPalette.contextBackground = paletteArray[2];
      state.lastPalette.contextText = paletteArray[3];
    },
    setLastNewColor( state, val ) {
      state.dev.addData( "LastNewColor", val );
      state.lastNewColor = val;
    },
    setReauthenticate( state, val ) {
      state.reauthenticate = val;
    },
    setShowColorModal( state, val ) {
      state.showColorModal = val;
    },
    setDevObject( state, val ) {
      state.dev = val;
    },
    setCategoryFilter( state, val ) {
      state.categoryFilter = val;
    }
  },
  actions: {
    clearData( { commit } ) {
      commit( "setCurrentUser", null );
      commit( "setUserProfile", {} );
      commit( "setCards", [] );
    },
    /*
     The object as the argument is applying argument deconstruction to get at properties/methods of the
     "context" object of the store.  See https://vuex.vuejs.org/guide/actions.html
    */
    fetchUserProfile({ commit, state }) {
      fb.userCollection.doc( state.currentUser.uid ).get().then( res => {
        commit( "setUserProfile", res.data() )
      }).catch( err => {
        console.log( err );
      })
    },
    /*
     This method creates a "dev" object attached to the window that a developer can activate to track
     application behavior and expose certain functionality that otherwise is only available in certain
     scenarios.
    */
    createDevObject( { commit } ) {
      window.dev = {
        active: false,
        data: {},
        logs: [],
        addLog: function( msg ) {
          if( this.active ) {
            this.logs.unshift( msg );
          }
        },
        addData: function( collection, value ) {
          if( this.active ) {
            if( !this.data[ collection ] ) {
              this.data[ collection ] = [];
            }
            this.data[ collection ].unshift( value );
          }
        },
        clearAll: function() {
          this.data = {};
          this.logs = [];
          return "All dev data and logs cleared"
        },
        clearLogs: function() {
          this.logs = [];
          return "All dev log messages cleared"
        },
        clearData: function() {
          this.data = {};
          return "All dev data cleared"
        }
      };
      commit( "setDevObject", window.dev );
    }
  }
});
