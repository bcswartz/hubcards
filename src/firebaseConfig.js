// Import Firebase
import firebase from 'firebase'

/*
 Import the settings file containing the Firebase API key and settings for your Firebase project.
 The settings file can then be held out of your version control collection so you can share your
 code

 You can obtain the code for your settings from the Firebase console.  At this time, the settings should look
 something like this:

 config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "PROJECT_NAME.firebaseapp.com",
    databaseURL: "https://PROJECT_NAME.firebaseio.com",
    projectId: "PROJECT_NAME",
    storageBucket: "",
    messagingSenderId: "SOME_NUMBER"
}
*/
import config from './firebaseSettings'
import 'firebase/firestore'

firebase.initializeApp(config);

// Firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

const currentUser = auth.currentUser;

// Declare your Firebase collections.  In this case, we only have the User and Card collections
const userCollection = db.collection( "users" );
const cardCollection = db.collection( "cards" );

// Export these objects for use in other files
export {
    db,
    auth,
    currentUser,
    userCollection,
    cardCollection
}

