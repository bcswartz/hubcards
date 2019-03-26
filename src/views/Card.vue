<template>
    <div id="vueCard">
        <div id="topView">

            <form id="cardForm" class="viewForm" @submit.prevent>

            <div class="columns">
                <div class="column is-6">

                    <div class="columns">
                        <div class="column is-two-fifths">
                            <div class="field">
                                <label class="label" for="category">Category</label>
                                <div class="control">
                                    <input v-model.trim="cardForm.category" id="category" class="input" type="text" placeholder="Category/topic">
                                </div>
                            </div>
                        </div>
                        <div class="column is-three-fifths">
                            <div class="field">
                                <label class="label" for="title">Title</label>
                                <div class="control">
                                    <input v-model.trim="cardForm.title" id="title" class="input" type="text" placeholder="Title of card">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" for="content">Content</label>
                        <div class="control">
                            <textarea v-model.trim="cardForm.content" id="content" class="textarea" placeholder="The main content for your card"></textarea>
                        </div>
                    </div>


                    <div class="field">
                        <label class="label" for="context">Context</label>
                        <div class="control">
                            <textarea v-model.trim="cardForm.context" id="context" class="textarea" placeholder="Context/an example of the code or concept (optional)"></textarea>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column is-3">
                            <button @click="saveCard('save')" id="saveImage" class="button is-info">Save Card</button>
                        </div>
                        <div class="column is-5">
                            <button @click="saveCard('new')" id="saveImageAddNew" class="button is-info">Save Card And Start New Card</button>
                        </div>
                        <div class="column is-3">
                            <button @click="generateImage" id="generateImage" class="button is-info">Generate Image</button>

                        </div>
                    </div>

                    <transition name="fade">
                        <form-errors :errors="errors"></form-errors>
                    </transition>

                </div>
                <div class="column is-1">&nbsp;</div>
                <div class="column is-5">

                    <div class="columns">
                        <div class="column is-half">

                            <label class="label" for="cardBackground">Card background</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <div class="control">
                                        <input v-model.trim="cardForm.cardBackground" id="cardBackground" class="input colorInputBox" />
                                    </div>
                                </div>
                                <div class="control">
                                    <a class="button is-warning" @click="openColorPicker( 'cardBackground' )">
                                        <i class="fas fa-palette"></i>
                                    </a>
                                </div>
                            </div>

                            <label class="label" for="cardText">Card text</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <div class="control">
                                        <input v-model.trim="cardForm.cardText" id="cardText" class="input colorInputBox" />
                                    </div>
                                </div>
                                <div class="control">
                                    <a class="button is-warning" @click="openColorPicker( 'cardText' )">
                                        <i class="fas fa-palette"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                        <div class="column is-half">


                            <label class="label" for="contextBackground">Context background</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <div class="control">
                                        <input v-model.trim="cardForm.contextBackground" id="contextBackground" class="input colorInputBox" />
                                    </div>
                                </div>
                                <div class="control">
                                    <a class="button is-warning" @click="openColorPicker( 'contextBackground' )">
                                        <i class="fas fa-palette"></i>
                                    </a>
                                </div>
                            </div>

                            <label class="label" for="contextText">Context text</label>
                            <div class="field has-addons">
                                <div class="control">
                                    <div class="control">
                                        <input v-model.trim="cardForm.contextText" id="contextText" class="input colorInputBox" />
                                    </div>
                                </div>
                                <div class="control">
                                    <a class="button is-warning" @click="openColorPicker( 'contextText' )">
                                        <i class="fas fa-palette"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    <h4 class="is-size-4">Preview</h4>

                    <div class="previewImageBox" :style="{'background-color': cardForm.cardBackground, 'color': cardForm.cardText}">
                        <div class="previewImageCategoryBox">
                            {{cardForm.category}}
                        </div>
                        <div class="previewImageTitleBox">
                            {{cardForm.title}}
                        </div>
                        <div class="previewImageContentBox">
                            {{cardForm.content}}
                        </div>
                        <div class="previewImageContextBox" v-if="cardForm.context" :style="{'background-color': cardForm.contextBackground, 'color': cardForm.contextText}">
                            {{cardForm.context}}
                        </div>
                        <div class="previewImageFooterBox">
                            <p>(Empty footer to leave room for Home Hub time and temp)</p>
                        </div>
                    </div>
                </div>
            </div>


            </form>

        </div>
        <div id="singleCardImageOutput" class="cardImageBox" :style="{'background-color': cardForm.cardBackground, 'color': cardForm.cardText}">
            <div class="cardImageCategoryBox">
                {{cardForm.category}}
            </div>
            <div class="cardImageTitleBox">
                {{cardForm.title}}
            </div>
            <div class="cardImageContentBox">
                {{cardForm.content}}
            </div>
            <div class="cardImageContextBox" v-if="cardForm.context" :style="{'background-color': cardForm.contextBackground, 'color': cardForm.contextText}">
                {{cardForm.context}}
            </div>
            <div class="cardImageFooterBox"></div>
        </div>

        <color-selection-modal :color-target="colorTarget"></color-selection-modal>

    </div>
</template>

<script>

    const htmlToImage = require('html-to-image');
    const download = require('downloadjs');

    import FormErrors from "../components/FormErrors";
    import ColorSelectionModal from "../components/ColorSelectionModal";
    import { mapState } from 'vuex';
    import { cardCollection } from "../firebaseConfig";

    import moment from 'moment';

    export default {
        name: "Card",
        components: { FormErrors, ColorSelectionModal },
        computed: {
            ...mapState( [ "dev", "userProfile", "colors", "lastPalette" ] )
        },
        data: function() {
            return {
                cardForm: {
                    category: "",
                    title: "",
                    content: "",
                    context: "",
                    cardBackground: "yellow",
                    cardText: "black",
                    contextBackground: "black",
                    contextText: "white"
                },
                lastGenerated: null,
                lastGeneratedBy: null,
                errors: [],
                cardId: null,
                colorTarget: null
            }
        },
        methods: {
            getCard() {
              this.errors = [];
              cardCollection.doc( this.cardId ).get().then( result => {
                  if( result.exists ) {
                      let cardData = result.data();
                      for( let prop in this.cardForm ) {
                          this.cardForm[ prop ] = cardData[ prop ] || this.cardForm[ prop ];
                      }
                      this.lastGenerated = cardData.lastGenerated;
                      this.lastGeneratedBy = cardData.lastGeneratedBy;
                  } else {
                      this.errors.push( "Card record not found." );
                  }
              })
            },
            getLastPalette() {
                this.cardForm.cardBackground = this.lastPalette.cardBackground;
                this.cardForm.cardText = this.lastPalette.cardText;
                this.cardForm.contextBackground = this.lastPalette.contextBackground;
                this.cardForm.contextText = this.lastPalette.contextText;
            },
            updateLastPalette() {
                this.$store.commit( "setLastPalette", [ this.cardForm.cardBackground, this.cardForm.cardText, this.cardForm.contextBackground, this.cardForm.contextText ] );
                // Reset the manually-generated color set in the color modal:  if the user needs it again, it is now part of the color history.
                this.$store.commit( "setLastNewColor", "" );
            },
            isFormValid() {
                let isValid = true;
                if( this.cardForm.category === "" ) {
                    this.errors.push( "Category required" );
                    isValid = false;
                }
                if( this.cardForm.title === "" ) {
                    this.errors.push( "Title required" );
                    isValid = false;
                }
                if( this.cardForm.content === "" ) {
                    this.errors.push( "Content required");
                    isValid = false;
                }
                return true;
            },
            saveCard( action ) {
                if( !this.isFormValid() ) {
                    return;
                }
                let cardDoc = {
                    category: this.cardForm.category,
                    title: this.cardForm.title,
                    content: this.cardForm.content,
                    context: this.cardForm.context,
                    cardBackground: this.cardForm.cardBackground,
                    cardText: this.cardForm.cardText,
                    contextBackground :this.cardForm.contextBackground,
                    contextText: this.cardForm.contextText,
                    lastUpdated: new Date(),
                    lastUpdatedBy: this.userProfile.firstName + " " + this.userProfile.lastName,
                    lastGenerated: this.lastGenerated,
                    lastGeneratedBy: this.lastGeneratedBy
                };
                if( this.cardId ) {
                    cardCollection.doc( this.cardId ).set( cardDoc, { merge: true } ).then( result => {
                        this.dev.addLog( "Card with id " + this.cardId + " updated." );
                        this.completeSaveAction( action );
                    }).catch( err => {
                        this.errors.push( err.message );
                    });
                } else {
                    cardDoc.createdBy = this.userProfile.firstName + " " + this.userProfile.lastName;
                    cardDoc.createdOn = new Date();
                    cardCollection.add( cardDoc ).then( result => {
                        this.dev.addLog( "New card added." );
                        this.completeSaveAction( action );
                    }).catch( err => {
                        this.errors.push( err.message );
                    });
                }
            },
            completeSaveAction( action ) {
                this.updateLastPalette();
                if( action == 'new' ) {
                    this.startNewCard();
                } else {
                    this.$router.push( "/cards")
                }
            },
            generateImage() {
                htmlToImage.toPng( document.getElementById( "singleCardImageOutput" ), { cacheBust: true } )
                    .then( dataUrl => {
                        this.dev.addLog( "Generating image for " + this.cardForm.title );
                        download( dataUrl, this.generateFilename() + ".png" );
                        this.lastGenerated = new Date();
                        this.lastGeneratedBy = this.userProfile.firstName + " " + this.userProfile.lastName;
                        if( this.cardId ) {
                            cardCollection.doc( this.cardId ).set(
                                { lastGenerated: this.lastGenerated, lastGeneratedBy: this.lastGeneratedBy},
                                { merge: true }
                            ).then( result => {
                                this.dev.addLog( "Image generation data saved to document" );
                            }).catch( err => {
                                this.errors.push( err.message );
                            });
                        }
                    });
            },
            generateFilename() {
              let filename;
              let dateString = moment( new Date() ).format( "YYYY-MM-DD" );
              let timeString = moment( new Date() ).format( "YYYY-MM-DD-hh-mm-ss");
              switch( this.userProfile.fileNamingScheme ) {
                  case "title":
                      filename = this.cardForm.title;
                      break;
                  case "category-title":
                      filename = this.cardForm.category + "-" + this.cardForm.title;
                      break;
                  case "date-title":
                      filename = dateString + "-" + this.cardForm.title;
                      break;
                  case "date-category-title":
                      filename = dateString + "-" + this.cardForm.category + "-" + this.cardForm.title;
                      break;
                  case "datetime-title":
                      filename = timeString + "-" + this.cardForm.title;
                      break;
                  case "datetime-category-title":
                      filename = timeString + "-" + this.cardForm.category + "-" + this.cardForm.title;
                      break;
              }
              return filename;
            },
            openColorPicker( colorTarget ) {
                this.colorTarget = colorTarget;
                this.$store.commit( "setShowColorModal", true );
            },
            startNewCard() {
                for( let prop in this.cardForm ) {
                    this.cardForm[ prop ] = "";
                }
                this.cardId = null;
                this.lastGenerated = null;
                this.lastGeneratedBy = null;
                this.getLastPalette();
            },
            prepComponent( context ) {
                this.cardId = this.$route.params.id;
                if( this.cardId ) {
                    this.getCard();
                } else {
                    this.startNewCard();
                }
                if( context == "created" ) {
                    this.$on( "colorSelected", colorValue => {
                        this.dev.addLog( "Setting color of " + this.colorTarget + " to " + colorValue );
                        this.cardForm[ this.colorTarget ] = colorValue;
                    });
                }

            }
        },
        created() {
            this.dev.addLog( "created method of Card component invoked" );
            this.prepComponent( "created" );
        },
        beforeRouteUpdate( to, from, next ) {
            this.dev.addLog( "beforeRouteUpdate method of Card component invoked" );
            this.prepComponent( "beforeRouteUpdate" );
            next();
        },
        beforeRouteEnter( to, from, next ) {
            next( vm => {
                if( !vm.$store.state.loggedIn ) {
                    next( { path: '/login' } );
                }
            })
        },
    }
</script>

<style scoped>

    #topView {
        background-color: white;
        margin-left: -15px;
        margin-top: -25px;
        min-height: 1328px;
        padding: 30px 20px;
        width: 110%;
        z-index: 100;
    }

    .cardImageBox {
        height: 784px;
        left: 0px;
        position: absolute;
        top: 0px;
        width: 1328px;
        z-index: -1;
    }

    .cardImageCategoryBox {
        font-size: 350%;
        font-weight: bold;
        position: absolute;
        right: 50px;
        text-align: right;
        top: 40px;
        width: 1228px;
    }

    .cardImageTitleBox {
        font-size: 320%;
        font-weight: bold;
        left: 50px;
        position: absolute;
        text-align: left;
        top: 120px;
        width: 1228px;
    }

    .cardImageContentBox {
        font-size: 240%;
        left: 50px;
        overflow-wrap: break-word;
        position: absolute;
        text-align: left;
        top: 200px;
        width: 1228px;
    }

    .cardImageContextBox {
        border-radius: 20px;
        bottom: 175px;
        font-family: "Courier New";
        font-size: 175%;
        font-weight: bold;
        left: 50px;
        overflow-wrap: break-word;
        padding: 20px;
        position: absolute;
        text-align: left;
        width: 1228px;
    }

    .cardImageFooterBox {
        bottom: 0px;
        height: 170px;
        left: 50px;
        position: absolute;
        width: 1228px;
    }

    .previewImageBox {
        width: 580px;
        height: 340px;
        margin-left:0px;
        margin-top: 20px;
        position: relative;
    }

    .previewImageCategoryBox {
        font-size: 150%;
        font-weight: bold;
        position: absolute;
        right: 10px;
        text-align: right;
        top: 10px;
        width: 560px;
    }

    .previewImageTitleBox {
        font-size: 120%;
        font-weight: bold;
        left: 10px;
        position: absolute;
        text-align: left;
        top: 40px;
        width: 560px;
    }

    .previewImageContentBox {
        font-size: 110%;
        left: 10px;
        overflow-wrap: break-word;
        position: absolute;
        text-align: left;
        top: 80px;
        width: 560px;
    }

    .previewImageContextBox {
        border-radius: 5px;
        bottom: 70px;
        font-family: "Courier New";
        font-size: 80%;
        font-weight: bold;
        left: 15px;
        overflow-wrap: break-word;
        padding: 5px;
        position: absolute;
        text-align: left;
        width: 550px;
    }

    .previewImageFooterBox {
        border-top: 1px solid #666;
        bottom: 0px;
        height: 65px;
        left: 10px;
        position: absolute;
        width: 560px;
    }

    div.previewImageFooterBox > p {
        color: #666;
        padding: 1ex 0ex 3ex 0ex;
        text-align: center;
    }

</style>