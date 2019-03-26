<template>
    <div class="modal" :class="{ 'is-active': showColorModal }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Choose Color</p>
                <button @click="closeModal" class="delete"></button>
            </header>
            <section class="modal-card-body">

                <div class="columns">
                    <div class="column is-6">
                        <div class="columns">
                            <div class="column is-8">
                                <div class="field has-addons">
                                    <div class="control">
                                        <a class="button is-static has-text-weight-bold">
                                            New color
                                        </a>
                                    </div>
                                    <div class="control">
                                        <div class="control">
                                            <input v-model.trim="newColor" id="newColor" class="input colorInputBox" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="column is-3">
                                <div class="colorHit newColorHit" :style="{'background-color': newColor }" @click="chooseColor( newColor )" ></div>
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="columns">
                            <div class="column is-4">
                                <p class="has-text-weight-bold has-text-right" style="margin-top:4px;">Last Set</p>
                            </div>
                            <div class="column is-2">
                                <div class="colorHit" @click="chooseColor( lastPalette.cardBackground )" :style="{'background-color': lastPalette.cardBackground }"></div>
                            </div>
                            <div class="column is-2">
                                <div class="colorHit" @click="chooseColor( lastPalette.cardText )" :style="{'background-color': lastPalette.cardText }"></div>
                            </div>
                            <div class="column is-2">
                                <div class="colorHit" @click="chooseColor( lastPalette.contextBackground)" :style="{'background-color': lastPalette.contextBackground }"></div>
                            </div>
                            <div class="column is-2">
                                <div class="colorHit" @click="chooseColor( lastPalette.contextText )" :style="{'background-color': lastPalette.contextText }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />
                <p class="has-text-centered has-text-weight-bold" style="margin-bottom:20px !important;">Previous Colors</p>

                <div v-for="row in colorRows" class="columns">
                    <div v-for="color in row" class="column is-1">
                        <div class="colorHit" :style="{'background-color': color}" @click="chooseColor( color )" ></div>
                    </div>
                </div>

            </section>
            <footer class="modal-card-foot"></footer>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ColorSelectionModal",
        props: [ "colorTarget" ],
        computed: {
            ...mapState( [ "showColorModal", "lastPalette", "colors", "lastNewColor", "dev" ] )
        },
        data: function() {
            return {
                colorRows: [],
                newColor: ""
            }
        },
        methods: {
            chooseColor( colorValue ) {
                this.$parent.$emit( "colorSelected", colorValue );
                this.dev.addLog( "Color " + colorValue + " selected." );
                this.closeModal();
            },
            closeModal() {
                this.$store.commit( "setLastNewColor", this.newColor );
                this.$store.commit( "setShowColorModal", false );
            }
        },
        created() {
            this.newColor = this.lastNewColor;
            let r = 0;
            this.colorRows[ r ]  = [];
            this.colors.forEach( function( color, index ) {
                this.colorRows[ r ].push( color );
                if( (index+1) % 12 == 0 ) {
                    r += 1;
                    this.colorRows[ r ] = [];
                }
            }, this );
        }
    }
</script>

<style scoped>

    .colorHit {
        border: 1px solid #ccc;
        border-radius: 9px;
        cursor: pointer;
        height: 36px;
        width: 36px;
    }

    .newColorHit {
        margin-top: 0px;
    }

</style>