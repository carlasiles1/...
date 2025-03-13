<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios"; // Import axios for HTTP requests and md5 for hash generation
import md5 from "md5";

// Reactive variables
const marvelComics = ref([]);
const selectedEvent = ref("Infinity");
const loading = ref(false);
const selectedComic = ref(null);
const comicDetails = ref(null);

// API keys
const marvelApiPublicKey = 'c6505251612e731238b4d32531d6a998';
const marvelApiPrivateKey = 'ee80321c4497db2e446a64fb6b78d032066c80e1';

// Object with events and their IDs
const events = {
  "Age of Apocalypse": 227,
  "Age of Ultron": 314,
  "Annihilation": 229,
  "Annihilation: Conquest": 231,
  "Avengers Disassembled": 234,
  "Avengers NOW!": 320,
  "Avengers VS X-Men": 310,
  "Blood and Thunder": 238,
  "Chaos War": 296,
  "Civil War": 238,
  "Civil War II": 330,
  "Days of Future Present": 242,
  "Fear Itself": 302,
  "Infinity": 315,
  "Infinity Gauntlet": 253,
  "Infinity War": 29,
  "Planet Hulk": 212,
  "Secret Wars": 270,
  "Secret Empire": 336,
  "Secret Invasion": 269,
  "Secret Wars II": 271
};

// Fetch comics for the selected event
const fetchMarvelComics = async () => {
  loading.value = true;
  
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + marvelApiPrivateKey + marvelApiPublicKey);

  try {
    const response = await axios.get("https://gateway.marvel.com/v1/public/comics", {
    // Initiates a try-catch block and makes a GET request to the Marvel API.

    // Define request parameters including limit, API key, timestamp, hash, selected event ID, and order.
      params: {
        limit: 100,
        apikey: marvelApiPublicKey,
        ts: timestamp,
        hash: hash,
        events: events[selectedEvent.value],
        orderBy: "-focDate"
      },
    });
 // Map the response results to a simpler format and assign to marvelComics.
    marvelComics.value = response.data.data.results.map((comic) => ({
      id: comic.id,
      title: comic.title,
      image: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    }));
    console.log("Comics loaded:", marvelComics.value);
  } catch (error) {
    console.error(`Error fetching comics for ${selectedEvent.value}:`, error);
  } finally {
    loading.value = false;

  }
};

onMounted(() => {
  fetchMarvelComics();
});

// Watch for changes in selectedEvent and call fetchMarvelComics when it changes
watch(selectedEvent, async() => {
  await fetchMarvelComics();
});

// New method to handle comic click and fetch detailed information
const goToWiki = async (comic,event) => {
  event?.preventDefault(); // Prevent displacement 
  selectedComic.value = comic;
  loading.value = true;
  try {
    const timestamp = new Date().getTime();
    const hash = md5(timestamp + marvelApiPrivateKey + marvelApiPublicKey);
    const response = await axios.get(`https://gateway.marvel.com/v1/public/comics/${comic.id}`, {
      params: {
        apikey: marvelApiPublicKey,
        ts: timestamp,
        hash: hash
      }
    });
    const comicData = response.data.data.results[0];
    comicDetails.value = {
      title: comicData.title || 'No title available',
      description: comicData.description || 'No description available',
      publishDate: new Date(comicData.dates.find(date => date.type === 'onsaleDate').date).toLocaleDateString(),
      writers: comicData.creators.items.filter(creator => creator.role === 'writer').map(creator => creator.name),
      pencillers: comicData.creators.items.filter(creator => creator.role === 'penciller').map(creator => creator.name),
      coverArtists: comicData.creators.items.filter(creator => creator.role === 'penciller (cover)').map(creator => creator.name),
      series: comicData.series.name || 'No series available',
      issueNumber: comicData.issueNumber || 'N/A'
    };
  } catch (error) {
    console.error('Error fetching comic details:', error);
  } finally {
    loading.value = false;
  }
};

// New function to close the pop-up
const closePopup = () => {
  selectedComic.value = null;
  comicDetails.value = null;
};
</script>

<template>
  <section class="section-timeline"> 
    <div class="section-timeline__container">     
      <div class="section-eventSelector">
        <p class="section-timeline__title">{{ selectedEvent }} comics</p>
        <select v-model="selectedEvent" @change="changeEvent" class="section-timeline__select">
          <option v-for="(id, event) in events" :key="id" :value="event">{{ event }}</option>
          <!-- "event" represents the key (which is the event name) and "id" the value (event ID) in each iteration -->
        </select>
      </div>
      <div v-if="loading" class="loading_class">Loading...</div>
      <div v-else-if="marvelComics.length === 0">Not found</div><!-- This line displays "Not found" if the marvelComics array is empty -->
      <div v-else class="section-timeline__comics">
        <div v-for="comic in marvelComics" :key="comic.id" class="comic-card" @click="goToWiki(comic, $event)">
          <img :src="comic.image" :alt="comic.title" class="comic-card__image" />
          <p class="comic-card__title">{{ comic.title }}</p>
        </div>
      </div>
   
    </div>

    <!-- Pop-up for comic details -->
    <div v-if="selectedComic && comicDetails" class="comic-details-popup">
      <div class="comic-details">
        <button @click="closePopup" class="close-button">×</button>
        <div class="comic-header">
          <h2>{{ comicDetails.title }}</h2>
          <img :src="selectedComic.image" :alt="comicDetails.title" class="comic-details__image" />
        </div>
        <div class="comic-info">
          <p><strong>Published:</strong> {{ comicDetails.publishDate }}</p>
          <p><strong>Series:</strong> {{ comicDetails.series }}</p>
          <p><strong>Issue Number:</strong> {{ comicDetails.issueNumber }}</p>
          <p><strong>Writer(s):</strong> {{ comicDetails.writers.join(', ') || 'N/A' }}</p>
          <p><strong>Penciller(s):</strong> {{ comicDetails.pencillers.join(', ') || 'N/A' }}</p>
          <p><strong>Cover Artist(s):</strong> {{ comicDetails.coverArtists.join(', ') || 'N/A' }}</p>
          <p><strong>Description:</strong> {{ comicDetails.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-timeline {
  display: flex;
  gap: 2rem;
  flex-direction: column;
  justify-content: center;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  padding: 2rem;
  height: 100vh;
  background-image: url('@/assets/img/timelineBkg2.png');
  background-size:contain;
  background-repeat: repeat-x;
  background-position: top left;
  background-color: black;
  width: auto; /* Evita fijar un ancho mínimo */
 
}

.section-eventSelector {
  position: sticky;
  left: 0;
  background: rgb(0, 0, 0);
  color: white;
  padding: 1rem;

  z-index: 10;
  height: fit-content; 
  width: fit-content;
}

.section-timeline__container {
  display: flex;
  gap: 1rem;
  padding-bottom: 2rem;
  width: 100%;
  background: none;
  min-width: 2000px;
  height: 80%;
}

.section-timeline__title {
  color: #fdfbfb;
  margin-bottom: 1rem;
  background: black;
  font-size: 1.1rem;
  max-width: fit-content;
}

.section-timeline__select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  width: 200px;
  color: white;
  background-color: black;
}

.section-timeline__comics {
  display: flex;
  gap: 6rem;
  padding: 3rem;
  align-items: center;
  /* scroll-behavior: smooth; */

}

.comic-card {
  flex: 0 0 auto;
  width: 12rem;
  opacity: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.comic-card:hover {
  opacity: 80%;
  transform: scale(1.05);
}

.comic-card__image {
  width: 100%;
  border-radius: 8px;
}

.comic-card__title {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
  color: rgb(219, 217, 217);
  background: rgb(0, 0, 0);
}

.section-timeline__button {
  background: rgb(58, 52, 65);
  color: rgb(212, 212, 212);
  border: none;
  border-radius: 50%;
  padding: 1rem;
  padding-inline: 1.2rem;
  font-size: 1.5rem;
  cursor: pointer;
}


.section-timeline__buttons {
 position: sticky;
  left: 0;
  z-index: 12;

}  

.comic-details-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.comic-details {
  background-image: url('@/assets/img/timelineBkg2.png');
  background-size: cover;
  color: #fff;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4757;
}

.comic-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.comic-header h2 {
  margin-bottom: 0.5rem;
  color: #ff6b6b;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.comic-info {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.comic-info p {
  margin-bottom: 0.5rem;
  white-space: normal;
  overflow: visible;
}


.comic-info p {
  margin-bottom: 0.5rem;

}


.comic-info strong {
  color: #5352ed;
}

.comic-details__image {
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}
.comic-info {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0.5rem;
}
.loading_class{
  color:rgb(255, 255, 255);
  text-align: center;
  width: 20vw;
  padding-top: 10rem;
  font-size: 3.5rem;
  padding-inline: 1rem;
  animation: shadow-dance 2s infinite;

}
   
@keyframes shadow-dance {
    0%, 100% {
      padding-inline: 1rem;
    }
    50% {
      padding-inline: 0.05rem;
    }
}


</style>