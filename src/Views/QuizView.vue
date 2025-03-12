<style scoped>
    .quiz-view__scoreboard {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        z-index: -10;
        transition: 1s;
    }
    .quiz-view__button-container {
        position: absolute;
        bottom: 10rem;
        left: 6rem;
        color: rgb(206, 178, 21);
        font-size: 1.5rem;
        text-align: center;
        z-index: 11;
    }
    .quiz-view__button-image {
        width: 4rem;
        cursor: pointer;
    }
    @media (max-width: 1600px) {
        .quiz-view__quiz{
            overflow: hidden    ;
        }
        .quiz-view__button-container {
            bottom: 11rem;
            left: 2rem;
            font-size: 1.5rem;
            z-index: 11;
        }
        .quiz-view__button-text{
            margin: 0;
        }
        .quiz-view__button-image {
            width: 4rem;
        }
    }
    @media  (max-width: 700px) {
        .quiz-view__button-text{
            display: none;
        }
    }
</style>

<template>
    <div class="quiz-view">
        <QuizComponent 
        class="quiz-view__quiz"/>
        <ScoreBoard 
            ref="scoreBoardRef" 
            class="quiz-view__scoreboard" 
            :style="scoreCSS"
        />
        <div class="quiz-view__button-container">
            <img 
                src="@/assets/img/marvelButton.png" 
                alt="Marvel X-men Button" 
                @click="toggleScores"
                class="quiz-view__button-image"
            >
            <p class="quiz-view__button-text">See scores</p>
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

