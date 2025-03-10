<template>
    <section class="about">
  
      <!-- Content section -->
      <div class="content">
     <div class="image">
       <img :src="imageSrc" alt="imagen">
     </div>
     <div class="text">
       <h1>About</h1>
      
       <section>
        <h2>What is the Marvel Timeline Project?</h2>
        <p>A web app that displays the Marvel Universe events in chronological order, focusing on comics.</p>
      </section>
  
      <section>
        <h2>What value does this project offer to Marvel fans?</h2>
        <ul>
          <li><strong>Comprehensive Exploration:</strong> Shows how comics connect over time.</li>
          <li><strong>Interactive Quiz:</strong> Test your Marvel knowledge in a fun way.</li>
          <li><strong>Easy to Use:</strong> User-friendly interface for easy navigation.</li>
        </ul>
      </section>
  
      <section>
        <h2>How is the information organized?</h2>
        <ul>
          <li><strong>Timeline:</strong> Events organized in chronological order with links to comics.</li>
          <li><strong>Quiz:</strong> A fun quiz section to test Marvel knowledge.</li>
        </ul>
      </section>
     </div>
   </div>
  
    </section>
  </template>
  <script setup>
  import imageSrc from '@/assets/img/Background-footer.jpg';
  </script>
  
  <style scoped>
  /* Section Styling */
  .about {
    background-color: #191129; /* Black background */
    color: #fff;
    padding: 100px 50px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-family: 'Roboto', sans-serif;
    overflow: hidden;
    animation: fadeIn 1s ease-out;
    flex-direction: column; /* Stack logo and content */
    padding: 20px 50px;
    min-height: 80vh; /* Ocupa el 90% de la pantalla */}
  
  
  /* Content Box */
  .content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    background-color: #191129; /* Dark content box */
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    animation: slideUp 1s ease-out;
  }
  
  .content:hover {
    transform: scale(1.05);
  }
  
  /* Image Styling */
  .image {
    flex: 1;
    text-align: center;
    padding-right: 30px;
    position: relative;
  }
  
  .image img {
    max-width: 80%; /* Reduce el tamaño al 80% */
    height: auto;
    border-radius: 10px;
    filter: brightness(70%);
    transition: filter 0.3s ease, transform 0.3s ease;
  }
  
  
  .image img:hover {
    filter: brightness(100%);
    transform: scale(1.05);
  }
  
  /* Text Styling */
  .text {
    flex: 1;
    padding-left: 20px;
    text-align: left;
  }
  
  h1 {
    font-size: 2.5rem; /* Smaller font size */
    margin-bottom: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px; /* Slightly smaller letter spacing */
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
    transition: transform 0.3s ease;
  }
  
  h1:hover {
    transform: translateX(10px);
  }
  
  p {
    font-size: 1rem; /* Slightly smaller font size */
    line-height: 1.6;
    color: #e0e0e0;
    text-align: justify;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
  }
  
  /* Animations */
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    0% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  </style>
  