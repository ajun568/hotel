<template>
    <div>
        <input 
            type="file" 
            id="imgsFileName" 
            ref="imgsFileName" 
            name="file" 
            accept="application/x-zip-compressed, application/x-rar-compressed" 
            on-progress="handleProgress"
            @change='showImgsFile'/>
        <el-progress :percentage="percent"></el-progress>
    </div>
</template>
<script>
export default {
    data() {
        return {
           percent: 20,
        }
    },
    methods: {
       showImgsFile() {

       },
       handleProgress(event,file) {
           console.error(event,'-------',file)
       },
    },
    mounted() {
        
    },
}
</script>
<style scoped>

</style>