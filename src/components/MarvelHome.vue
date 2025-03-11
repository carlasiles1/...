<style scoped>


main{
  background-image: url('@/assets/img/marvelHomeBkg2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  justify-content: center;
  align-items: center;
  /* max-width: fit-content; */
  /* overflow-x: scroll; /* Scroll solo horizontal */
  /*overflow-y: hidden; Oculta el scroll vertical */
  /* scroll-behavior: smooth; Suaviza el scroll */
  width: fit-content;
  height: 100vh; /* Evita que se extienda hacia abajo */
  white-space: nowrap; /* Evita que los elementos se vayan hacia abajo */
  display: flex;
}

main::-webkit-scrollbar {
  display: none; /* Oculta la barra de scroll */
}

.logo{
  width: 15rem;
  height: 10rem;
  position: relative;
  animation: bit 2s ease-in-out infinite alternate;
  cursor: pointer;
}

.hammer{
  width: 10rem;
  position: absolute;
  left: 110rem;
  z-index: -1;
  display: none; /* para hacer desaparecer el martillo */
}

.animation-hammer{
  animation: thorHammer 1s linear 1;
}

@keyframes thorHammer {
  0%{
    left: 110rem;
    z-index: 1;
  }
  50%{
    left: 67rem;
  }
  100%{
    left: -15rem;
    z-index: 1;
  }
}
.animation-move {
  animation-name: move, bit;
  animation-duration: 0.5s, 1s;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 0.5s, 0s;
}
@keyframes move{
  0%{
    left: 0rem;
  }
  100%{
    left: -82rem;
  }
}
@keyframes bit {
  0%{
    width: 15rem;
    height: 10rem;
  }
  70%{
    width: 15rem;
    height: 10rem;
  }
  80%{
    width: 17rem;
    height: 12rem;
  }
}

.gif-arrows{
  
  position: fixed;
  bottom: 5rem;
  right: 15rem;
  align-self:first baseline;
  color: whitesmoke;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  
  line-height: 0;
 /* mix-blend-mode: multiply;  */
  /* animation: fadein 4s ease-in alternate infinite; */
  opacity:70%;
}

@keyframes fadein {
    from { opacity: 0; }
    to { opacity: 0.8; }
} 

.section-timeline__button {
 background: none;
  color: rgb(212, 212, 212);
  border: 0.05rem solid white;
  border-radius: 50%;
  padding: 1rem;
  padding-inline: 1.2rem;
  font-size: 1.5rem;
  cursor: pointer;
  margin-inline: 3rem;
}

.section-timeline__button:hover{
  background-color: rgba(255, 253, 253, 0.351);
  color: rgb(25, 25, 36);
}


 .section-timeline__buttons {
  position: fixed;
  bottom: 11rem;
  right: 12rem;
  align-self:first baseline;
  z-index: 12;
}  

@media only screen and (max-width: 1000px) {
.gif-arrows{
  display: none;
}
}

</style>

<template>
  <main>
    <img src="@/assets/img/logoTimeline.png" alt="Marvel Logo" :class="['logo', {'animation-move': isdo}]" v-on:click="flyHammer">
    <img src="@/assets/img/thorHammer.png" alt="Thor Hammer moving" :class="['hammer', {'animation-hammer': isdo}]">
    <div class="gif-arrows" v-show="showArrows"><img src= "@/assets/img/arrow-keys.gif" alt="keyboard_arrows" width="150px"><p class="gif-arrows_texto">Use the keyboard or arrow buttons to navigate the timeline</p></div>

  </main>

</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue';

const showArrows = ref(true); 

const isdo = ref(false);


const flyHammer = () => {
  isdo.value = false
  setTimeout(() => {
    isdo.value = true
  }, 0)
}

const handleKeyScroll = (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    showArrows.value = false; // Hide the GIF when an arrow key is used
  }
};
onMounted(() => {
  window.addEventListener("keydown", handleKeyScroll);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyScroll);
});




</script>