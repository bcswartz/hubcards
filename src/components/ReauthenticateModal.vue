<template>
    <div class="modal" :class="{ 'is-active': reauthenticate }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Reauthenticate</p>
                <button @click="closeModal" class="delete"></button>
            </header>
            <section class="modal-card-body">
                <p>You must reauthenticate to finish performing the operation.</p>
                <br />
                <form id="credentialsForm" @submit.prevent>
                    <div class="field">
                        <label class="label" for="reauthEmail">Email</label>
                        <div class="control">
                            <input v-model.trim="credentialsForm.email" id="reauthEmail" class="input" type="text" placeholder="yourEmail@email.com" autocomplete="username email">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="reauthPassword">Password</label>
                        <div class="control">
                            <input v-model.trim="credentialsForm.password" id="reauthPassword" class="input" type="password" placeholder="*************" autocomplete="current-password">
                        </div>
                    </div>
                </form>

                <button @click="loginUser" :disabled="performingRequest" class="button is-info actionButton">Reauthenticate</button>

                <form-errors :errors="errors"></form-errors>

            </section>
            <footer class="modal-card-foot"></footer>
        </div>
    </div>
</template>

<script>
    import FormErrors from "./FormErrors";
    import { mapState } from "vuex";
    import { auth } from "../firebaseConfig";

    export default {
        name: "ReauthenticateModal",
        props: [ "attemptedAction" ],
        components: { FormErrors },
        computed: {
            ...mapState( [ "reauthenticate", "currentUser", "dev" ] )
        },
        data() {
            return {
                credentialsForm: {
                    email: "",
                    password: ""
                },
                errors: [],
                performingRequest: false
            }
        },
        created() {
            this.credentialsForm.email = this.currentUser && this.currentUser.email ? this.currentUser.email : "";
        },
        methods: {
            closeModal() {
                this.errors = [];
                this.performingRequest = false;
                this.$store.commit( 'setReauthenticate', false );
            },
            loginUser() {
                this.errors = [];
                this.performingRequest = true;
                auth.signInWithEmailAndPassword( this.credentialsForm.email, this.credentialsForm.password ).then( userCredential => {
                    this.dev.addLog( "Reauthentication successful" );
                    this.dev.addData( "reauthenticationCredential", userCredential );
                    this.$store.commit( "setCurrentUser", userCredential.user );
                    this.$store.dispatch( "fetchUserProfile" );
                    // Here we emit the reauthentication event that will be picked up by the UserAccount.vue component
                    this.$parent.$emit( "reauthenticated", this.attemptedAction );
                    this.performingRequest = false;
                    this.closeModal();
                }).catch( err => {
                    this.errors.push( err.message );
                    this.performingRequest = false;
                })
            }
        }
    }
</script>

<style scoped>
    .actionButton {
        margin: 3ex 0ex 1ex 0ex;
    }
</style>