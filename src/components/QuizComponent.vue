<style scoped>
input[type='radio']{
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
    background-color: #191129;
    margin-right: 1rem;
    border: 2px solid rgb(206, 178, 21);
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
.quiz__pointer {
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
.marvel-quiz__dialog{
    background-color: #433168;
    border: 15px double rgb(206, 178, 21);
    border-radius: 20%;
    height: 20rem;
    width: 30rem;
    color: wheat;
}
.marvel-quiz__dialog-button{
    display: block;
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
                                class="quiz__pointer ">
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
        <dialog ref="dialogRef" class="marvel-quiz__dialog">
            <h2 class="marvel-quiz__dialog-title">Congratulations!</h2>
            <p class="marvel-quiz__dialog-text">Your final score is: {{ score }}</p>
            <label class="marvel-quiz__dialog-label">
                <span v-if="savedMessage" class="marvel-quiz__dialog-message">{{ savedMessage }}</span>
                <input 
                type="text" 
                v-model="playerName" 
                class="marvel-quiz__dialog-input">
            </label>
            <button 
            @click="saveScore" 
            class="marvel-quiz__dialog-button">
            Save & Close
            </button>
        </dialog>
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

const dialogRef = ref(null)
const playerName = ref('')
const savedMessage = ref('')

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

const next = () => {
    const correct = document.querySelector(`label:has(input[value="${randomQuestions.value[currentQuestion.value].answer}"])`)
    correct.style = 'background-color: green';

    // Corregir el selector para obtener el input seleccionado
    const response = document.querySelector(`input[name="choseOption"]:checked`)
    if (response) {
        userAnswers.value[currentQuestion.value] = response.value
        
        if (response.value === randomQuestions.value[currentQuestion.value].answer) {
            score.value++
        }
    }

    setTimeout(() => {
        if (currentQuestion.value < randomQuestions.value.length - 1) {
            currentQuestion.value++
            page.value = currentQuestion.value + 1
            correct.style = '';
        } else {
            finalScore()
        }
    }, 1000)
}

const prev = () => {
    if (currentQuestion.value > 0) {
        currentQuestion.value--
        page.value = currentQuestion.value + 1
    }
}

const finalScore = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal()
  }
}

const closeDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.close()
  }
}

const saveScore = async () => {
  if (!playerName.value.trim()) {
    savedMessage.value = 'Type your winner name!!'
    return
  }

  try {
    const date = new Date()
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
    
    const newScore = {
      name: playerName.value.trim(),
      score: score.value,
      date: formattedDate
    }
    
    // Agregamos mejor manejo de errores y logging
    const response = await fetch('http://localhost:3000/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newScore)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Server response:', errorData)
      throw new Error(`Error saving score: ${response.status}`)
    }

    const data = await response.json()
    console.log('Score saved:', data)
    savedMessage.value = '¡Score saved successfully!'
    
    setTimeout(() => {
      closeDialog()
    }, 1500)

  } catch (error) {
    console.error('Error details:', error)
    savedMessage.value = `Error saving score: ${error.message}`
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

    const searchName = characterName
      .toLowerCase()
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const response = await axios.get("https://gateway.marvel.com/v1/public/characters", {
      params: {
        apikey: marvelApiPublicKey,
        ts: timestamp,
        hash: hash,
        nameStartsWith: searchName,
        limit: 1
      },
    })
    
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
};

// Modificar el watcher para currentQuestion
watch(currentQuestion, async () => {
  await loadCurrentQuestionCharacters();
});

// Añade esta función después de la declaración de marvelCharacter
const matchingCharacter = computed(() => {
  return (option) => {
    // Normalizar el nombre de la opción
    const normalizedOption = option.toLowerCase()
      .replace(/-/g, ' ')  // Reemplazar guiones por espacios
      .replace(/\s+/g, ' ') // Normalizar espacios múltiples
      .trim();

    return marvelCharacter.value.find(character => {
      // Normalizar el nombre del personaje de la API
      const normalizedCharName = character.name.toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Comprobar si los nombres coinciden o si uno contiene al otro
      return normalizedCharName === normalizedOption ||
             normalizedCharName.includes(normalizedOption) ||
             normalizedOption.includes(normalizedCharName);
    });
  };
});
</script>