<style scoped>
input{
    display: none;
}
.quiz {
    background-color: #191129;
    justify-content: center;
    align-items: center;
    margin: -0.5rem;
    height: 100vh;
}
.quiz_screen{
    display: flex;
    justify-content: center;
}
.quiz__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.quiz__title {
    color: #ca1a1a;
    text-align: center;
    width: 30%;
    margin: 0;
    padding-top: 6rem;
}
.quiz__question-text {
    font-size: 2rem;
    color: rgb(206, 178, 21);
}
.options{
    display: flex;
}
.quiz__label {
    color: white;
    width: 10rem;
    display: flex;
    text-align: center;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    border-radius: 20%;
    margin: 3rem;
}
.quiz__label::after {
    background-color: #007BFF;
}
.quiz__label p{
    width: 100%;
}
.quiz__input {
    margin-right: 1rem;
}   
.quiz__navigation{
    display: flex;
    align-items: center;
    color: #e62429;
}
.quiz__button {
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    width: 5rem;
    height: 2rem;
    border-radius: 2rem 0;
    transition: 0.3s;
    margin: 0 4rem;
}
.quiz__button:hover {
    background-color: #e62429;
}
.quiz__image {
    width: 22rem;
    margin-left: 8rem;
}
.pointer{
    position: absolute;
    width: 5rem;
    transform: rotateZ(-35Deg) translate(6rem, 3rem);
}
.character-image {
    width: 15rem;
    height: 15rem;
    object-fit: cover;
    border-radius: 10%;
}
</style>

<template>
    <main class="quiz">
        <h1 class="quiz__title">Avengers Comics Quiz</h1>
        <div class="quiz_screen">
            <form class="quiz__form" id="quizForm">
                <div v-if="randomQuestions.length" class="quiz__question">
                    <p class="quiz__question-text">{{ randomQuestions[currentQuestion].question }}</p>
                    <div class="options">
                        <label v-for="option in randomQuestions[currentQuestion].options" 
                            :key="option" 
                            class="quiz__label">
                            <input type="radio" 
                                name="choseOption" 
                                :value="option" 
                                v-model="userAnswers[currentQuestion]">
                            <p>{{ option }}</p>
                            <img v-if="matchingCharacter(option)"
                                :src="matchingCharacter(option).image" 
                                :alt="matchingCharacter(option).name"
                                class="character-image">
                            <img v-if="userAnswers[currentQuestion] === option" 
                                :src="source" 
                                alt="Iron-man Pointer" 
                                class="pointer">
                        </label>
                    </div>
                </div>
                <div class="quiz__navigation">
                    <button @click="prev" class="quiz__button quiz__button--prev" type="button">Prev</button>
                    <p>{{ page }} / 15</p>
                    <button @click="next" class="quiz__button quiz__button--next" type="button">Next</button>
                </div>
            </form>
            <img class="quiz__image" src="@/assets/img/theWatcher.png" alt="The Watcher">
        </div>
    </main>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import axios from "axios";
import md5 from "md5";

const quiz = ref({})
const randomQuestions = ref([])
const currentQuestion = ref(0)
const userAnswers = ref({})
const score = ref(0)
const source = ref('')

const page = ref('')
page.value = 1

//Cuando sale dos veces el mismo nombre en una respuesta seguido, se queda printado en verde

const selected = new Set()

const fetchQuiz = async () => {
        try {
            const response = await fetch('/quiz.json')
            if (!response.ok) {
                throw new Error('Error loading data')
            }
            const data = await response.json()
            quiz.value = data
        } catch (error) {
            console.error('Error loading data', error)
        }

        source.value = new URL ('@/assets/img/ironPointer.png', import.meta.url).href

        getRandomQuestions()
    }
onMounted(async () => {
  await fetchQuiz();
  await loadCurrentQuestionCharacters();
})

const getRandomQuestions = ()=>{
    const total = quiz.value.questions.length

    while(selected.size < 15){
        const randomIndex = Math.floor(Math.random() * total)
        selected.add(randomIndex)
    }
    randomQuestions.value = Array.from(selected).map(index => quiz.value.questions[index])
}

const next = ()=>{

    const correct = document.querySelector(`label:has(input[value="${randomQuestions.value[currentQuestion.value].answer}"])`)
    correct.style = 'background-color: green';

    const response = document.querySelector(`input[name="${currentQuestion.value}"]:checked`)
    if (response){
        userAnswers.value[currentQuestion.value] = response.value
        
        if (response.value === randomQuestions.value[currentQuestion.value].answer){
            score.value++
        }
    }

    setTimeout(() =>{
        if (currentQuestion.value < randomQuestions.value.length -1){
            currentQuestion.value++
            page.value = currentQuestion.value + 1
        } else {
            alert(`Congratulations!!! Your final score is: ${score.value}`)
        }
    },1000)
}

const prev = () => {
    if (currentQuestion.value > 0) {
        currentQuestion.value--
        page.value = currentQuestion.value + 1
    }
}

//Uso de la API

const marvelCharacter = ref([])

const marvelApiPublicKey = 'c6505251612e731238b4d32531d6a998';
const marvelApiPrivateKey = 'ee80321c4497db2e446a64fb6b78d032066c80e1';

// Modificar la función fetchMarvelComics para que devuelva el personaje
const fetchMarvelComics = async (characterName) => {
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + marvelApiPrivateKey + marvelApiPublicKey);

  try {
    const response = await axios.get("https://gateway.marvel.com/v1/public/characters", {
      params: {
        apikey: marvelApiPublicKey,
        ts: timestamp,
        hash: hash,
        nameStartsWith: characterName,
        limit: 2
      },
    })

    console.log(response.data.data.results)
    
    if (response.data?.data?.results?.[0]) {
      const character = response.data.data.results[0];
      return {
        name: character.name.toLowerCase(),
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`
      };
    }
    return null;
    } catch (error) {
    console.error("Error getting data for " + characterName, error);
    return null;
  }
};
onMounted(fetchMarvelComics)

// Añadir función para cargar los personajes de la pregunta actual
const loadCurrentQuestionCharacters = async () => {
  if (!randomQuestions.value[currentQuestion.value]) return;
  
  marvelCharacter.value = []; // Limpiar personajes anteriores
  const options = randomQuestions.value[currentQuestion.value].options;
  
  // Cargar los personajes de todas las opciones
  const characters = await Promise.all(
    options.map(option => fetchMarvelComics(option))
  );
  
  // Filtrar null y añadir los personajes encontrados
  marvelCharacter.value = characters.filter(char => char !== null);
  
  console.log("Personajes cargados para la pregunta actual:", 
    marvelCharacter.value.map(char => char.name));
};

// Modificar el watcher para currentQuestion
watch(currentQuestion, async () => {
  await loadCurrentQuestionCharacters();
});

// Añade esta función después de la declaración de marvelCharacter
const matchingCharacter = computed(() => {
  return (option) => {
    return marvelCharacter.value.find(
      character => character.name === option.toLowerCase()
    );
  };
});
</script>