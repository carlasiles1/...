<template>
  <footer :class="[
    'footer', 
    { 'footer--show': showFooter && !isStaticPage },
    { 'footer--static': isStaticPage },
    { 'footer--default': !showFooter && !isStaticPage }
  ]">
    <div class="footer__container">
      <div class="footer__content">
        <div class="footer__logo">
          <img src="@/assets/img/Marvel Logo.png" alt="Marvel Logo" class="footer__logo-image">
        </div>
        <nav class="footer__nav">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="footer__nav-link">
            {{ link.text }}
          </router-link>
        </nav>
        <div class="footer__social">
          <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank" class="footer__social-icon">
            <font-awesome-icon :icon="['fab', social.icon]" />
          </a>
        </div>
      </div>
    </div>
    <div class="footer__copyright">
      <p class="footer__copyright-text">&copy; {{ currentYear }} Marvel. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentYear = ref(new Date().getFullYear());
const showFooter = ref(false);

const isStaticPage = computed(() => ['/about', '/contact', '/quiz'].includes(route.path));

const navLinks = [
  { to: '/', text: 'Home' },
  { to: '/contact', text: 'Contact' },
  { to: '/about', text: 'About' },
  { to: '/quiz', text: 'Quiz' }
];

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/Marvel', icon: 'facebook-f' },
  { name: 'Twitter', url: 'https://twitter.com/Marvel', icon: 'twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/marvel', icon: 'instagram' }
];

const handleMouseMove = (event) => {
  if (!isStaticPage.value) {
    const windowHeight = window.innerHeight;
    const mouseY = event.clientY;
    showFooter.value = mouseY > windowHeight - 100;
  }
};

onMounted(() => {
  if (!isStaticPage.value) {
    window.addEventListener('mousemove', handleMouseMove);
  }
});

onUnmounted(() => {
  if (!isStaticPage.value) {
    window.removeEventListener('mousemove', handleMouseMove);
  }
});
</script>

<style scoped>
.footer {
  color: #fff;
  padding: 0.5rem 0 0.5rem;
  font-family: 'Arial', sans-serif;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  transition: transform 0.9s ease;
}

.footer--default {
  background: linear-gradient(45deg, #070215, #3d3d3d);
  transform: translateY(100%);
}

.footer--show {
  background: linear-gradient(45deg, #070215, #3d3d3d);
  transform: translateY(0);
}

.footer--static {
  background: linear-gradient(45deg, #070215, #3d3d3d);
  transform: translateY(0);
  transition: none;
}

.footer::before,
.footer::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-image: url('@/assets/img/Background-footer.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  transition: transform 0.5s ease;
}

.footer::before {
  left: -250px;
  bottom: -250px;
}

.footer::after {
  right: -250px;
  top: -250px;
}

.footer:hover::before {
  transform: translate(20px, -20px);
}

.footer:hover::after {
  transform: translate(-20px, 20px);
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer__content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  margin-top: 1.6rem;
}

.footer__logo-image {
  width: 3rem;
  transition: transform 0.3s ease;
  margin-left: 7rem;
}

.footer__logo-image:hover {
  transform: scale(1.1);
}

.footer__nav {
  display: flex;
  justify-content: center;
  margin-right: 3.5rem;
  gap: 2rem;
}

.footer__nav-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
  font-weight: bold;
  font-size: 1.1rem;
  position: relative;
}

.footer__nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #e62429;
  transition: width 0.3s ease;
}

.footer__nav-link:hover {
  color: #e62429;
  transform: translateY(-2px);
}

.footer__nav-link:hover::after {
  width: 100%;
}

.footer__social {
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
}

.footer__social-icon {
  color: inherit;
  font-size: 1.7rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.footer__social-icon:hover {
  color: #e62429;
  transform: scale(1.2) rotate(5deg);
}

.footer__copyright {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-right: 1.3rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 0.3rem 0;
  }

  .footer__content {
    grid-template-columns: 1fr;
    gap: 0.3rem;
    margin-top: 0.5rem;
  }

  .footer__logo-image {
    margin-left: 0;
    width: 2rem;
  }

  .footer__nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-right: 0;
    gap: 0.5rem 1rem;
  }

  .footer__social {
    justify-content: center;
    margin-left: 0;
    gap: 1rem;
  }

  .footer__copyright {
    margin-right: 0;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .footer__nav-link {
    font-size: 0.8rem;
  }

  .footer__social-icon {
    font-size: 1.2rem;
  }

  .footer__copyright {
    font-size: 0.7rem;
  }
}

</style>
