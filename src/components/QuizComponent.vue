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

@media (max-width: 1600px) {
  .character-image {
    width: 8rem;
    height: 8rem;
  }
  .quiz__label {
      width: 4rem;
      display: flex;
      text-align: center;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      border-radius: 20%;
      margin: 3rem;
  }
}

@media (max-width: 1200px) {
  .quiz__title {
    width: 100%;
  }
  .quiz__image {
    display: none;
  }
  .quiz__question {
    width: 100%;
  }
}

@media  (max-width: 450px) {
  .quiz {
    height: 200%;
  }
  .options{
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 4.15rem;
  }
  .quiz__label {
    color: white;
    height: 5rem;
  }
  .quiz__question-text {
    font-size: 1.5rem;
    margin-left: 2rem;
  }
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

//ref for the question display
const quiz = ref({})
//Ref for randomize the questions
const randomQuestions = ref([])
//Ref for show the actual question and its option
const currentQuestion = ref(0)
//Ref for save the answered questions
const userAnswers = ref({})
//Ref for display the score
const score = ref(0)
//The img of the iron-man hand pointer
const source = ref('')

//Ref for show the question page
const page = ref('')
page.value = 1

//Ref for showing the final dialog
const dialogRef = ref(null)
//ref for put and save the player's name
const playerName = ref('')
//ref for display a message after save your name
const savedMessage = ref('')

//a set that only admits one item type (question), per array
const selected = new Set()


//Fetch for get the questions from the json
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
        //Creating the pointer
        source.value = new URL ('@/assets/img/ironPointer.png', import.meta.url).href

        getRandomQuestions()
    }
onMounted(async () => {
  await fetchQuiz();
  await loadCurrentQuestionCharacters();
})

const getRandomQuestions = ()=>{
  //total question length
    const total = quiz.value.questions.length

    //set the set size in 15
    while(selected.size < 15){
        const randomIndex = Math.floor(Math.random() * total)
        selected.add(randomIndex)
    }
    //Mix the 15 random numbers with the question id to get an array of 15 questions
    randomQuestions.value = Array.from(selected).map(index => quiz.value.questions[index])
}
//Next page function and much more
const next = () => {
    const correct = document.querySelector(`label:has(input[value="${randomQuestions.value[currentQuestion.value].answer}"])`)
    //The correct answer highlighted in green
    correct.style = 'background-color: green';

    // Queryselector in :checked for getting the chossen answer
    const response = document.querySelector(`input[name="choseOption"]:checked`)
    if (response) {
        userAnswers.value[currentQuestion.value] = response.value
        //If it's correct, +1 point
        if (response.value === randomQuestions.value[currentQuestion.value].answer) {
            score.value++
        }
    }
    //time out for let the user see the correct answer
    setTimeout(() => {
        if (currentQuestion.value < randomQuestions.value.length - 1) {
            //next question & reset
            currentQuestion.value++
            page.value = currentQuestion.value + 1
            correct.style = '';
        //If it's the llas question, show the modal for put your name
        } else {
            finalScore()
        }
    }, 1000)
}
//previous question
const prev = () => {
    if (currentQuestion.value > 0) {
        currentQuestion.value--
        page.value = currentQuestion.value + 1
    }
}
//show in the dialog the final score
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
//Show msg if no name and save user data
const saveScore = async () => {
  if (!playerName.value.trim()) {
    savedMessage.value = 'Type your winner name!!'
    return
  }

  try {
    //Formatting date 99/12
    const date = new Date()
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
    //saving the user data
    const newScore = {
      name: playerName.value.trim(),
      score: score.value,
      date: formattedDate
    }
    
    // Fetch from the web to POST in a json via json server
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
//API use for character images
//Ref for each character stored
const marvelCharacter = ref([])

const marvelApiPublicKey = 'c6505251612e731238b4d32531d6a998';
const marvelApiPrivateKey = 'ee80321c4497db2e446a64fb6b78d032066c80e1';

// Fetch for each question
const fetchMarvelComics = async (characterName) => {
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + marvelApiPrivateKey + marvelApiPublicKey);

  try {
    //Name clear
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
    //Matching character name with character apis name
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

// Function to load character
const loadCurrentQuestionCharacters = async () => {
  if (!randomQuestions.value[currentQuestion.value]) return;
  
  marvelCharacter.value = []; // Clear last characters
  const options = randomQuestions.value[currentQuestion.value].options;
  
  // Load each  characters
  const characters = await Promise.all(
    options.map(option => fetchMarvelComics(option))
  );
  
  //filter characters 
  marvelCharacter.value = characters.filter(char => char !== null);
};

watch(currentQuestion, async () => {
  await loadCurrentQuestionCharacters();
});
//Normalize the  character name for a clear search
const matchingCharacter = computed(() => {
  return (option) => {

    const normalizedOption = option.toLowerCase()
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return marvelCharacter.value.find(character => {
      
      const normalizedCharName = character.name.toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Comprove if the  characters name matches
      return normalizedCharName === normalizedOption ||
             normalizedCharName.includes(normalizedOption) ||
             normalizedOption.includes(normalizedCharName);
    });
  };
});
</script>