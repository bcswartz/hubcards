<template>
    <div id="loginVue">
        <div class="columns">
            <div class="column is-4">
                <h3 class="is-size-3">Login</h3>

                <form id="loginForm" class="viewForm" @submit.prevent>
                    <div class="field">
                        <label class="label" for="loginEmail">Email</label>
                        <div class="control">
                            <input v-model.trim="loginForm.email" id="loginEmail" class="input" type="text" placeholder="yourEmail@email.com" autocomplete="username">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="loginPassword">Password</label>
                        <div class="control">
                            <input v-model.trim="loginForm.password" id="loginPassword" class="input" type="password" placeholder="*************" autocomplete="current-password">
                        </div>
                    </div>

                    <button id="loginButton" @click="login" class="button is-info">Log In</button>

                    <transition name="fade">
                        <form-errors :errors="errors"></form-errors>
                    </transition>
                </form>

            </div>
            <div class="column">
                <transition name="fade">
                    <div v-if="performingRequest" class="loading">
                        <p>Loading...</p>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import FormErrors from "../components/FormErrors";
    import { mapState } from "vuex";
    const fb = require( "../firebaseConfig.js" );
    export default {
        name: "Login",
        components: { FormErrors },
        computed: {
            ...mapState( [ "dev" ] )
        },
        data: function() {
            return {
                loginForm: {
                    email: "",
                    password: ""
                },
                showLoginForm: true,
                performingRequest: false,
                errors: []
            }
        },
        methods: {
            login() {
                this.performingRequest = true;
                this.errors = [];
                fb.auth.signInWithEmailAndPassword( this.loginForm.email, this.loginForm.password ).then( userCredential => {
                    /*
                     Check to see if a matching user document exists in the user collection.  If not, prevent the login.
                     Did this because the only way to delete the user authentication record is by logging in as that
                     user.  Which seems to mean that you cannot create a web application that lets you delete a user
                     account.
                    */
                    fb.userCollection.doc( userCredential.user.uid ).get().then( result => {
                        if( result.exists ) {
                            this.$store.commit( "setCurrentUser", userCredential.user );
                            this.$store.dispatch( "fetchUserProfile" );
                            this.performingRequest = false;
                            this.$router.push( "/cards" );
                        } else {
                            this.dev.addLog( "No user document for user " + userCredential.user.email );
                            this.errors.push( "User document no longer exists" );
                        }
                        this.performingRequest = false;
                    });

                }).catch( err => {
                    this.dev.addData( "errorObjects", err );
                    this.errors.push( err.message );
                    this.performingRequest = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">

    #loginButton {
        margin-top: 10px;
    }

</style>