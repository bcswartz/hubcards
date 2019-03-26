<template>
    <div id="vueNavigationBar">
        <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <p id="brandText">Hubcards</p>
            </div>
            <div id="navbarItems" class="navbar-menu">
                <div class="navbar-start">
                    <!--
                      The "exact" attribute ensures this Home link is not always flagged as active, since "/" is
                      the root of all the routes.  This is covered in the Vue Router documentation.
                     -->
                    <router-link class="navbar-item is-tab" to="/" exact>Cards</router-link>
                    <router-link class="navbar-item is-tab" to="/settings">Settings</router-link>
                    <router-link class="navbar-item is-tab" to="/setup">Setup</router-link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <button v-if="currentUser" @click="routeToUserAccount" class="button is-warning">Your Account</button>
                        <button v-if="!users.length || dev.active" @click="routeToCreateAppUser" class="button is-warning">Create App User</button>
                    </div>
                    <div class="navbar-item">
                        <login-logout-button v-if="users.length"></login-logout-button>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    import LoginLogoutButton from "./LoginLogoutButton";
    import { mapState } from "vuex";
    export default {
        name: "NavigationBar",
        components: { LoginLogoutButton },
        computed: {
            ...mapState([ "currentUser", "users", "dev" ] )
        },
        methods: {
            routeToCreateAppUser() {
                this.$router.push( "/create-app-user" );
            },
            routeToUserAccount() {
                this.$router.push( "/user-account" );
            }
        }
    }
</script>

<style scoped>
    #brandText {
        color: #160b36;
        font-size:130%;
        font-weight: bold;
        line-height:1.0;
        padding: 1rem 1.75rem 1rem 1rem;
    }
</style>