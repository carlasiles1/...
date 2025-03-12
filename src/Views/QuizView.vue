<style scoped>
    .score {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        z-index: -10;
        transition: 1s;
    }
    .button{
        position: absolute;
        bottom: 10rem;
        left: 7rem;
        color: rgb(206, 178, 21);
        font-size: 1.5rem;
        text-align: center;
        z-index: 11;
    }
    .button img{
        width: 4rem;
        cursor: pointer;
    }
</style>

<template>
    <div>
        <QuizComponent 
        class="quiz"/>
        <ScoreBoard ref="scoreBoardRef" class="score" :style="scoreCSS"/>
        <div class="button">
            <img src="@/assets/img/marvelButton.png" alt="Marvel X-men Button" @click="toggleScores">
            <p>See scores</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import QuizComponent from '../components/QuizComponent.vue';
import ScoreBoard from '../components/ScoreBoard.vue'

const scoreBoardRef = ref(null)
const scoreCSS = ref({
    opacity: '0',
    zIndex: '-10',
})

const toggleScores = async ()=>{
    scoreCSS.value.opacity = scoreCSS.value.opacity === '0'? '1': '0'
    scoreCSS.value.zIndex = scoreCSS.value.zIndex === '-10'? '10': '-10'

    scoreBoardRef.value?.loadScores()
}
</script>

