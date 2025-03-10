<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import md5 from "md5";

// Variables reactivas
const marvelCharacters = ref([]);
const currentCharacterIndex = ref(0);
const currentCharacter = ref(null);
let intervalId = null;

// Claves de la API
const marvelApiPublicKey = 'c6505251612e731238b4d32531d6a998';
const marvelApiPrivateKey = 'ee80321c4497db2e446a64fb6b78d032066c80e1';

// IDs de los personajes principales
const avengersIds = [
  1009351, // Iron Man
  1009220, // Capitán América
  1009664, // Thor
  1009350, // Hulk
  1009610, // Spider-Man
  1009652, // Thanos
  1009368, // IronMan
];

// Obtener personajes de Marvel
const fetchMarvelCharacters = async () => {
  const timestamp = new Date().getTime();
  const hash = md5(timestamp + marvelApiPrivateKey + marvelApiPublicKey);

  try {
    const promises = avengersIds.map(async (id) => {
      const response = await axios.get("https://gateway.marvel.com/v1/public/characters", {
        params: {
          id,
          apikey: marvelApiPublicKey,
          ts: timestamp,
          hash: hash,
        },
      });

      return response.data.data.results[0]; // Devuelve el primer resultado (el personaje específico)
    });

    const results = await Promise.all(promises); // Esperar a que todas las solicitudes se completen

    // Filtrar personajes sin imagen o con datos incorrectos
    marvelCharacters.value = results
      .filter((character) => 
        character && // Asegúrate de que el personaje no sea nulo
        character.thumbnail.path !== "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" // Imagen disponible
      )
      .map((character) => ({
        id: character.id,
        name: character.name,
        image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
      }));

    // Mostrar el primer personaje
    if (marvelCharacters.value.length > 0) {
      currentCharacter.value = marvelCharacters.value[0];
    }

    // Iniciar el cambio de imágenes cada 3 segundos
    startImageRotation();

  } catch (error) {
    console.error("Error al obtener personajes de Marvel:", error);
  }
};

// Función para cambiar de personaje cada 3 segundos
const startImageRotation = () => {
  intervalId = setInterval(() => {
    if (marvelCharacters.value.length > 0) {
      currentCharacterIndex.value = (currentCharacterIndex.value + 1) % marvelCharacters.value.length;
      currentCharacter.value = marvelCharacters.value[currentCharacterIndex.value];
    }
  }, 3000);
};

// Detener el intervalo al desmontar el componente
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Cargar personajes al montar el componente
onMounted(fetchMarvelCharacters);
</script>

<template>
  <main class="main">
    <div class="main__container">
      <!-- Formulario a la izquierda -->
      <form id="formulario" class="form">
        <h1 class="form__title">Contact</h1>
        <p class="form_subtitle">Leave us a message!</p>
        <div class="form__group">
          <label for="nombre" class="form__label">Name:</label>
          <input type="text" id="nombre" name="nombre" class="form__input" required />
        </div>

        <div class="form__group">
          <label for="email" class="form__label">E-mail:</label>
          <input type="email" id="email" name="email" class="form__input" required />
        </div>

        <div class="form__group">
          <label for="mensaje" class="form__label">Message:</label>
          <textarea id="mensaje" name="mensaje" class="form__textarea" required></textarea>
        </div>
      </form>

      <!-- Sección de personajes a la derecha -->
      <div class="timeline">
        <div class="timeline__characters">
          <div v-if="currentCharacter" class="timeline__character-card">
            <img :src="currentCharacter.image" :alt="currentCharacter.name" class="timeline__character-image" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.main {
  background-color: #191129;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: -0.5rem;
}

.main__container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 400px;
}

.form__title {
  color: white;
  font-size: 2rem;
  margin-bottom: 3rem;
  text-align: left;
}

/* Estilos de los inputs y textarea */
.form__group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 100%;
}

.form__label {
  color: white;
  margin-bottom: 5px;
}

.form__textarea, .form__input {
  background-color: #191129;
  width: 100%;
  max-width: 350px;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-size: 16px;
}

.form__textarea {
  height: 100px;
  resize: none;
}

/* Contenedor de personajes */
.timeline {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 50%;
  overflow: hidden;
}

.timeline__characters {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  width: 400px;
  height: auto;
}

.timeline__character-card {
  width: 25rem;
  height: 25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.timeline__character-card:hover {
  opacity: 80%;
}

.timeline__character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.form_subtitle
{
  color:white;
  font-size: 25px;
  margin-top: 0.1rem;
  margin-bottom: 2rem;
  text-align: left;
}
</style>
