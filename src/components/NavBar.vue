<template>
  <header class="navbar">
    <nav class="navbar__nav">
      <ul class="navbar__list">
        <li class="navbar__list-item"><RouterLink to="/">HOME</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/about">ABOUT</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/quiz">QUIZ</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/contact">CONTACT</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
/* Contenedor general */
.navbar {
  width: 100%;
  z-index: 1000;
  background-image: transparent;
  padding: 15px 0;
  position: fixed;
}

/* Barra de navegación */
.navbar__nav {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Línea blanca semitransparente */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* Sombra sutil debajo */
}

/* Lista de navegación */
.navbar__list {
  list-style: none;
  display: flex;
  gap: 100px;
}

/* Estilo de los enlaces */
.navbar__list-item {
  text-transform: uppercase;
}

.navbar__list-item :hover {
  color: red;
}

.navbar__list-item a {
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
}
</style>
