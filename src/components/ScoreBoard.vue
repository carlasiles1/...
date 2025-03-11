<style scoped>
.scoreboard {
  background-color: rgba(0, 0, 0, 0.568);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scoreboard__main {
  background-color: #433168;
  font-size: 2rem;
  display: flex;
  width: 70%;
  height: 40rem;
  position: relative;
  border: 15px double rgb(206, 178, 21);
  border-radius: 20%;
}

.scoreboard__list {
  width: 70%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;  
  margin-left: 2rem;
  justify-items: center;
}

.scoreboard__item {
  margin: 1rem auto;
  width: 21rem;
  color: wheat;
}

.scoreboard__item::marker {
  color: rgb(206, 178, 21);
  font-weight: bold;
}

.scoreboard__item--first {
  font-size: 3rem;
  width: 100%;
  margin-left: 6rem;
}

.scoreboard__item--last {
  font-size: 1.5rem;
  width: 50%;
  margin: 1rem auto;
}

.scoreboard__shield {
  position: absolute;
  right: 0;
  top: 10%;
  width: 33rem;
}
</style>

<template>
  <div class="scoreboard">
    <main class="scoreboard__main">
        <ol class="scoreboard__list">
            <li class="scoreboard__item scoreboard__item--first">
                {{ sortedScores[0]?.name }} - {{ sortedScores[0]?.score }} points {{ sortedScores[0]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[1]?.name }} - {{ sortedScores[1]?.score }} points {{ sortedScores[1]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[2]?.name }} - {{ sortedScores[2]?.score }} points {{ sortedScores[2]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[3]?.name }} - {{ sortedScores[3]?.score }} points {{ sortedScores[3]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[4]?.name }} - {{ sortedScores[4]?.score }} points {{ sortedScores[4]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[5]?.name }} - {{ sortedScores[5]?.score }} points {{ sortedScores[5]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[6]?.name }} - {{ sortedScores[6]?.score }} points {{ sortedScores[6]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[7]?.name }} - {{ sortedScores[7]?.score }} points {{ sortedScores[7]?.date }}
            </li>
            <li class="scoreboard__item">
                {{ sortedScores[8]?.name }} - {{ sortedScores[8]?.score }} points {{ sortedScores[8]?.date }}
            </li>
            <li class="scoreboard__item scoreboard__item--last">
                {{ sortedScores[9]?.name }} - {{ sortedScores[9]?.score }} points {{ sortedScores[9]?.date }}
            </li>
        </ol>
        <img src="@/assets/img/shield.png" alt="shield decor" class="scoreboard__shield">
    </main>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'

const scores = ref([])

const sortedScores = computed(() => {
  return [...scores.value].sort((a, b) => b.score - a.score).slice(0, 10)
})

const loadScores = async () => {
  try {
    const response = await fetch('http://localhost:3000/scores')
    const data = await response.json()  
    scores.value = data
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
}

onMounted(loadScores)

defineExpose({
  loadScores
})
</script>