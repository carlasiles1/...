<template>
  <main ref="scrollContainer" :style="{ width: adjustMainWidth }">
    <MarvelHome class="marvel-home" />
    <div class="section-timeline__buttons"> 
    <button 
@mousedown="startScroll(-1)" 
@mouseup="stopScroll" 
@mouseleave="stopScroll" 
class="section-timeline__button section-timeline__button--left">⬅
</button>

<button 
@mousedown="startScroll(1)" 
@mouseup="stopScroll" 
@mouseleave="stopScroll" 
class="section-timeline__button section-timeline__button--right">➡
</button>
    </div>
    <TimeLineMarvel  />
    
  </main>
</template>

<script setup>
import { ref } from "vue";
import gsap from "gsap";
import MarvelHome from "../components/MarvelHome.vue";
import TimeLineMarvel from "../components/TimeLineMarvel.vue";
 
const scrollContainer = ref(null); 
const scrolling = ref(false);
const scrollAmount = 800; 

const scroll = (direction) => {
const container = scrollContainer.value;
  if (!container || !scrolling.value) return;

gsap.to(container, {
  scrollLeft: container.scrollLeft + direction * scrollAmount,
  duration: 0.5,
  ease: "power2.out",
  onComplete: () => {
    if (scrolling.value) scroll(direction); // Scroll continues if pressed
  },
});
};

const startScroll = (direction) => {
if (!scrolling.value) {
  scrolling.value = true;
  scroll(direction);
}
};

const stopScroll = () => {
scrolling.value = false;
};

document.addEventListener("keydown", (e) => {
if (e.key === "ArrowRight") startScroll(1);
if (e.key === "ArrowLeft") startScroll(-1);
});
document.addEventListener("keyup", stopScroll);

</script>

<style scoped>
main {
  display: flex;
  overflow-x: scroll; /* Allows horizontal scroll */
  overflow-y: hidden; 
  height: 100vh; 
  margin: 0; 
}
.marvel-home {
  min-width: 100vw; 
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
.section-timeline__buttons {

bottom: 10rem;
right: 20%; 
align-self: center;

}  
}
</style>