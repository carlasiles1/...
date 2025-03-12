<template>
  <header class="navbar">
    <nav class="navbar__nav">
      <ul class="navbar__list" :class="{ 'navbar__list--active': isMenuOpen }">
        <li class="navbar__list-item"><RouterLink to="/">HOME</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/about">ABOUT</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/quiz">QUIZ</RouterLink></li>
        <li class="navbar__list-item"><RouterLink to="/contact">CONTACT</RouterLink></li>
      </ul>
      <!-- Botón de hamburguesa alineado a la derecha -->
      <div class="hamburger-menu" @click="toggleMenu">
        <i>☰</i>
      </div>
    </nav>
  </header>
</template>


<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
/* General container styles for the navbar */
.navbar {
  width: 100%; /* Full width */
  z-index: 1000; /* Ensures navbar stays on top of other elements */
  background-image: transparent; /* Transparent background */
  padding: 15px 0; /* Vertical padding */
  position: fixed; /* Fixed position to stay at the top */
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; /* Font family */
}

/* Navigation bar container, centers the items horizontally */
.navbar__nav {
  display: flex; /* Use flexbox to lay out items */
  justify-content: center; /* Center the navigation items */
  align-items: center; /* Align items vertically in the middle */
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Bottom border with slight transparency */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* Subtle shadow below the navbar */
}

/* Navigation list styles */
.navbar__list {
  list-style: none; /* Remove default list styling */
  display: flex; /* Arrange list items in a row */
  gap: 100px; /* Original spacing between menu items */
}

/* Styles for navigation links */
.navbar__list-item {
  text-transform: uppercase; /* Make text uppercase */
}

/* Hover effect for list items */
.navbar__list-item:hover {
  color: red; /* Change text color to red when hovered */
}

/* Link styling */
.navbar__list-item a {
  text-decoration: none; /* Remove underline from links */
  color: white; /* White text color */
  font-size: 16px; /* Font size */
  font-weight: bold; /* Bold font weight */
}

/* Hamburger button styling */
.hamburger-menu {
  display: none; /* Initially hide the hamburger menu */
  cursor: pointer; /* Change cursor to pointer on hover */
  font-size: 30px; /* Set font size of the hamburger icon */
  color: white; /* Set icon color to white */
  background: none; /* Remove background */
  border: none; /* Remove border */
  margin-left: auto; /* Align the button to the right */
}

/* Media queries for mobile and tablet devices */
@media (max-width: 1024px) {
  /* By default, hide the navigation list on small screens */
  .navbar__list {
    display: none; /* Hide the list */
    flex-direction: column; /* Stack items vertically */
    gap: 20px; /* Reduced gap between items */
    position: absolute; /* Position the list absolutely */
    top: 60px; /* Position the menu just below the navbar */
    right: 0; /* Align the menu to the right */
    background-color: rgba(0, 0, 0, 0.8); /* Dark background for the menu */
    width: 250px; /* Set width of the menu */
    padding: 20px; /* Add padding to the menu */
    border-top: 1px solid rgba(255, 255, 255, 0.3); /* Top border */
    border-radius: 8px; /* Round corners */
  }

  /* Class to display the menu when it's active */
  .navbar__list--active {
    display: flex; /* Show the list */
  }

  /* Display the hamburger menu button on mobile/tablet */
  .hamburger-menu {
    display: block; /* Make the hamburger menu visible */
  }
}

/* Media query for very small screens (less than 768px) */
@media (max-width: 768px) {
  /* Adjust font size for smaller screens */
  .navbar__list-item a {
    font-size: 14px; /* Reduce font size */
  }

  /* Reduce the padding inside the menu */
  .navbar__list {
    padding: 10px; /* Decrease padding */
  }

  /* Increase the size of the hamburger icon */
  .hamburger-menu i {
    font-size: 35px; /* Increase icon size */
  }
}

</style>
