<template>
    <div id="vueSettings">
        <h3 class="is-size-3">Settings</h3>
        <br />
        <div class="columns">
            <div class="column is-5">
                <h4 class="is-size-4">File Naming Scheme</h4>
                <p>Determines the structure of the filename for generated images</p>
            </div>
            <div class="column is-7">
                <div v-for="option in fileNamingOptions" class="control">
                   <div class="columns">
                        <div class="column is-1">
                            <input type="radio" name="fileNamingChoice" v-model="fileNamingChoice" :value="option.value" @change="updateFilenameSetting">
                        </div>
                        <div class="column">
                            <span class="optionLabel">{{option.label}}</span><br />
                            <span class="optionDescription">{{option.description}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { userCollection } from "../firebaseConfig";

    import moment from 'moment';

    export default {
        name: "Settings",
        computed: {
            ...mapState( [ "currentUser", "userProfile", "dev" ] )
        },
        data: function() {
            return {
                fileNamingOptions: [
                    {
                        label: "{Card title}.png",
                        value: "title",
                        description: "Filename with card title only."
                    },
                    {
                        label: "{Card category}-{Card title}.png",
                        value: "category-title",
                        description: "Filename with card category followed by card name. Useful if duplicate titles exist between categories"
                    },
                    {
                        label: "{Date}-{Card title}.png",
                        value: "date-title" ,
                        description: "Filename with current date followed by card name. Useful for distinguishes different versions of cards created on different days."
                    },
                    {
                        label: "{Date}-{Card category}-{Card title}",
                        value: "date-category-title" ,
                        description: "Similar to the {Date}-{Card title} format but includes the card category."
                    },
                    {
                        label: "{Date and time}-{Card title}.png",
                        value: "datetime-title",
                        description: "Filename starts with both the date and time. Useful when generating multiple images of a card to get the layout right so you know which one is the most recent."
                    },
                    {
                        label: "{Date and time}-{Card category}-{Card title}.png",
                        value: "datetime-category-title",
                        description: "Similar to the {Date and time}-{Card title} format but includes the card category."
                    }
                ],
                errors: [],
                fileNamingChoice: null
            }
        },
        methods: {
            updateFilenameSetting() {
                userCollection.doc( this.currentUser.uid ).set( { fileNamingScheme: this.fileNamingChoice }, { merge: true } ).then( result => {
                    this.dev.addLog( "Filename setting updated." );
                    this.$store.dispatch( "fetchUserProfile" );
                }).catch( err => {
                    this.errors.push( err.message );
                });
            }
        },
        created() {
            this.fileNamingChoice = this.userProfile.fileNamingScheme;
        },
        beforeRouteEnter( to, from, next ) {
            next( vm => {
                if( !vm.$store.state.loggedIn ) {
                    next( { path: '/login' } );
                }
            })
        }
    }
</script>

<style scoped>
    span.optionLabel {
        font-weight: bold;
    }
    span.optionDescription {
        font-size: 80%
    }
</style>