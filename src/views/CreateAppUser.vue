<template>
    <div id="vueCreateAppUser">
        <div class="columns">
            <div class="column is-6">
                <h3 class="is-size-3">Create Application User</h3>

                <p>Create the user account for this application using the form below.  You will
                have a tool for updating your account later if you need to.</p>

                <form id="createUserForm" class="viewForm" @submit.prevent>

                    <div class="columns">
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="firstName">First Name</label>
                                <div class="control">
                                    <input v-model.trim="createUserForm.firstName" id="firstName" class="input" type="text" placeholder="First name">
                                </div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="field">
                                <label class="label" for="lastName">Last Name</label>
                                <div class="control">
                                    <input v-model.trim="createUserForm.lastName" id="lastName" class="input" type="text" placeholder="Last name">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="email">Email</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.email" id="email" class="input" type="text" placeholder="emailId@email.com" autocomplete="username">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="password">Password</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.password" id="password" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="passwordConfirmation">Confirm Password</label>
                        <div class="control">
                            <input v-model.trim="createUserForm.passwordConfirmation" id="passwordConfirmation" class="input" type="password" placeholder="*************" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-5">
                            <button @click="createUser()" id="createAppUser" class="button is-info">Create User Account</button>
                        </div>
                    </div>

                    <transition name="fade">
                        <form-errors :errors="errors"></form-errors>
                    </transition>
                </form>


            </div>
            <div class="column">
                <transition name="fade">
                    <div v-if="performingRequest">
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
        name: "CreateAppUser",
        computed: {
            ...mapState([ "currentUser", "dev" ])
        },
        components: { FormErrors },
        data: function() {
            return {
                createUserForm: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    passwordConfirmation: ""
                },
                performingRequest: false,
                errors: []
            }
        },
        methods: {
            isFormValid() {
                this.errors = [];
                let isValid = true;
                if( this.createUserForm.firstName === "" ) {
                    this.errors.push( "First name required" );
                    isValid = false;
                }
                if( this.createUserForm.lastName === "" ) {
                    this.errors.push( "Last name required" );
                    isValid = false;
                }
                if ( this.createUserForm.email === "" ) {
                    this.errors.push( "Email required" );
                    isValid = false;
                }
                if( this.createUserForm.password !== this.createUserForm.passwordConfirmation ) {
                    this.errors.push( "Passwords are not the same" );
                    isValid = false;
                }
                return isValid;
            },
            createUser() {
                if( !this.isFormValid() ) {
                    return;
                }
                this.performingRequest = true;
                fb.auth.createUserWithEmailAndPassword( this.createUserForm.email, this.createUserForm.password ).then( userCredential => {
                    this.$store.commit( "setCurrentUser", userCredential.user );
                    this.dev.addLog( "New user created: " + this.createUserForm.email );
                    this.dev.addData( "createdUsers", userCredential.user );

                    // Modify the returned user object
                    fb.userCollection.doc( userCredential.user.uid ).set({
                        firstName: this.createUserForm.firstName,
                        lastName: this.createUserForm.lastName,
                        emailAddress: this.createUserForm.email, // Adding email to the corresponding user document
                        fileNamingScheme: "date-title"
                    }).then(() => {
                        this.$store.dispatch( "fetchUserProfile" ) ;
                        this.performingRequest = false;
                        this.$router.push( "/cards" );
                    }).catch(err => {
                        this.dev.addData( "errorObjects", err );
                        this.errors.push( err.message );
                        this.performingRequest = false;
                    })
                }).catch(err => {
                    this.dev.addData( "errorObjects", err );
                    this.errors.push( err.message );
                    this.performingRequest = false;
                })
            }
        }
    }
</script>