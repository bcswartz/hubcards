<template>
    <div id="vueSetup">
        <div class="content">
            <h3>Installation and Setup</h3>
            <p>To setup and run your own copy of this application, simply do the following:</p>
            <ul>
                <li>
                    Install the latest version of <a href="https://cli.vuejs.org/" target="_blank">Vue CLI</a>
                </li>
                <li>
                    Checkout or download the code, then run "npm install" to install the needed packages.
                </li>
                <li>
                    Create a Firebase Cloud Firestore project and add the configuration settings to the codebase:
                    <ul>
                        <li>
                            Go to the <a href="https://firebase.google.com" target="_blank">Firebase website</a>.  Sign in using
                            your Google credentials.
                        </li>
                        <li>
                            In the menu bar, click "Go to Console".  Click on "Add Project".  Give the project a name and click
                            the "Continue" button.  Select any data sharing options you want and click "Create Project".  When the
                            project is ready, click "Continue"
                        </li>
                        <li>
                            The next screen will invite you to add Firebase to your app and display icons for iOS, Android, and the
                            web.  Click on the web icon.
                        </li>
                        <li>
                            A modal window will appear containing a code snippet.  All you need from the snippet is the
                            "config" object variable.
                        </li>
                        <li>
                            In the "src" directory of the codebase, create a file named "firebaseSettings.js".  Copy the "config"
                            object into that file and end the file with the line "export default config".  Example:
                            <pre class="configExample">
var config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "PROJECT_NAME.firebaseapp.com",
  databaseURL: "https://PROJECT_NAME.firebaseio.com",
  projectId: "PROJECT_NAME",
  storageBucket: "",
  messagingSenderId: "SOME_NUMBER"
};

export default config;
              </pre>
                        </li>
                        <li>
                            Return to the Firebase console view of your new Firebase project.  In the left column, click on
                            "Authentication".  In the Authentication panel, click on the "Sign-in method" menu item, then click on
                            the "Email/Password" option and enable it.  This enables the authentication method used in this
                            Vue application.  Click "Save".
                        </li>
                        <li>
                            In the left column of the console window, select "Database".  You will be prompted to create a
                            Cloud Firestore database.  Click the "Create database" button.
                        </li>
                        <li>
                            A modal window will appear to let you choose the security rules for your database.  Change the
                            default rule to the following to restrict certain actions to authenticated users, then click the "Enable" button:
                            <pre class="configExample">
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{card} {
      allow read, write: if request.auth.uid != null;
    }
    match /users/{user} {
      allow read;
      allow write: if request.auth.uid != null;
    }
     match /{document=**} {
      allow read, write;
    }
  }
}
                            </pre>
                        </li>
                        <li>
                            The Firebase side of the application is now ready to go:  you can either close the Firebase console,
                            or leave it open to observe the changes made as you use the application.
                        </li>
                    </ul>
                </li>
                <li>
                    Run the application using "npm run serve".
                </li>
                <li>
                    Click the "Create App User" in the navigation bar to create the first user account / document.
                </li>
            </ul>

        </div>
    </div>
</template>


<style scoped>

    ul {
        margin-top: 2ex;
    }

    ul > li {
        margin-bottom: 1.5ex;
    }

    .configExample {
        border:1px solid gray;
        border-radius: 10px;
        margin: 1em 1em 1em 3em;
        padding: 5px;
        width: 520px;
    }

</style>
