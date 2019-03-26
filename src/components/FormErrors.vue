<template>
    <div id="vueErrorContent" v-if="errors.length > 0" class="errorContent has-text-danger">
        <p>Please correct the following issues:</p>
        <ul class="errorList">
            <li v-for="error in errors">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "FormErrors",
        props: [ "errors" ]
    }
</script>

<style scoped>
    .errorContent {
        border: 1px solid red;
        border-radius: 5px;
        margin: 15px 0px;
        padding:10px;
    }
    .errorList {
        margin: 5px 0px 10px 0px;
        padding-left: 20px;
    }
    .errorList > li {
        list-style-type: disc;
    }
</style>