<template>
    <div id="vueUsers">

        <h3 class="is-size-3">Cards</h3>

        <transition name="fade">
            <div v-if="!dataReady" class="loading">
                <p class="is-size-4">Loading...</p>
            </div>
        </transition>

        <div v-if="dataReady">

            <div class="field is-pulled-right">
                <div class="control">
                    <button @click="addCard" class="button is-info topAddButton">Add New Card</button>
                </div>
            </div>
            <div class="field has-addons is-pulled-right">
                <div class="control">
                    <a class="button is-static">
                        Category
                    </a>
                </div>
                <div class="control">
                    <div class="select">
                    <select v-model="filter" @change="updateStoreFilter">
                        <option v-for="category in categories">{{ category }}</option>
                    </select>
                    </div>
                </div>
            </div>


            <div v-if="cards.length">
                <table id="cardTable" class="table is-bordered is-hoverable is-fullwidth">
                    <thead>
                    <tr>
                        <th>Category</th>
                        <th>Title</th>
                        <th>Last Updated</th>
                        <th>Last Generated</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!filteredCards.length">
                        <td colspan="5">There are no cards in the selected category.</td>
                    </tr>
                    <tr v-for="card in filteredCards">
                        <td>{{ card.category }}</td>
                        <td>{{ card.title }}</td>
                        <td>{{ card.lastUpdated | asDatetimeString }}</td>
                        <td>{{ card.lastGenerated | asDatetimeString }}</td>
                        <td>
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <button @click="editCard( card.id )" class="button is-primary">Edit</button>
                                    </div>
                                    <div class="level-item">
                                        <button @click="deleteCard( card.id )" class="button is-danger">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>There are currently no cards.</p>
            </div>

            <div class="field is-pulled-right">
                <div class="control">
                    <button @click="addCard" class="button is-info bottomAddButton">Add New Card</button>
                </div>
            </div>
            <transition name="fade">
                <form-errors :errors="errors"></form-errors>
            </transition>

        </div>
    </div>
</template>

<script>
    import FormErrors from "../components/FormErrors";
    import { mapState } from "vuex";
    import { cardCollection} from "../firebaseConfig";

    export default {
        name: "Users",
        components: {FormErrors},
        computed: {
            filteredCards: function() {
                return this.filter == "- All -" ? this.cards : this.cards.filter( card => card.category == this.filter );
            },
            ...mapState( [ "dataReady", "userProfile", "currentUser", "cards", "categories", "categoryFilter", "dev" ] )
        },
        data: function () {
            return {
                errors: [],
                filter: "- All -"
            }
        },
        methods: {
            editCard( cardId ) {
                // Example of the "by name" method of accessing a route
                this.$router.push( { name: "card", params: { id: cardId } } );
            },
            addCard() {
                // Example of the "by route string" method of accessing a route
                this.$router.push( "/card" );
            },
            deleteCard(cardId) {
                this.errors = [];
                // NOTE: the delete() will NOT error if you pass it an ID for a document that doesn't exist.
                cardCollection.doc(cardId).delete().then(result => {
                    this.dev.addLog("Card with id " + cardId + " deleted");
                }).catch(err => {
                    this.dev.addLog("Card deletion failed for id " + cardId);
                    this.dev.addData("errorObjects", err);
                    this.errors.push(err.message);
                })
            },
            updateStoreFilter() {
                this.$store.commit( "setCategoryFilter", this.filter );
            }
        },
        beforeRouteEnter( to, from, next ) {
            next( vm => {
                if( !vm.$store.state.loggedIn ) {
                    next( { path: '/login' } );
                }
            })
        },
        created() {
            this.filter = this.categoryFilter ? this.categoryFilter : this.filter;
        },
        beforeRouteUpdate( to, from, next ) {
            this.filter = this.categoryFilter ? this.categoryFilter : this.filter;
            next();
        }
    }
</script>

<style scoped lang="scss">

    #cardTable {
        margin: 15px 0px;
    }

    .topAddButton {
        margin-left:2ex;
    }

    .bottomAddButton {
        margin: 2ex 0ex;
    }

</style>