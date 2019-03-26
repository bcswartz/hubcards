<template>
    <!-- This component provides a single button that performs either a login or logoff
    action depending on whether a user is logged in (currentUser). -->
    <div id="vueLoginLogoutButton">
        <button
                @click="performAction"
                class="button"
                :class="buttonClass">
            {{ currentUser ? "Logout" : "Login" }}
        </button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import { auth } from "../firebaseConfig";

    export default {
        name: "LoginLogoutButton",
        computed: {
            // Applying a CSS class based on login state via a data property doesn't work because it doesn't update.
            buttonClass: function() {
                return {
                    "is-info": !this.currentUser,
                    "is-danger": !!this.currentUser
                }
            },
            ...mapState([ "currentUser", "dev" ] )
        },
        methods: {
            performAction() {
                this.currentUser ? this.performLogout() : this.performLogin();
            },
            performLogin() {
                this.$router.push( "/login" );
            },
            performLogout() {
                auth.signOut().then( () => {
                    this.$store.dispatch( "clearData" );
                    this.$router.push( "/login" );
                    this.dev.addLog( "Logout completed" );
                }).catch( err => {
                    this.dev.addData( "errorObjects", err );
                    this.dev.addLog( "Logout error occurred.  Message: " + err.message );
                })
            }
        }
    }
</script>
