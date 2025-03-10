import { createRouter, createWebHistory } from 'vue-router';
import MarvelHomeView from '../Views/MarvelHomeView.vue';
import ContactView from '../Views/ContactView.vue';
import QuizView from '../Views/QuizView.vue';
import AboutView from '../Views/AboutView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // Usar import.meta.env.BASE_URL en lugar de process.env.BASE_URL
  routes: [
    {
      path: '/',
      redirect: '/MarvelHome',
    },
    {
      path: '/MarvelHome',
      name: 'MarvelHome',
      component: MarvelHomeView,  // Sin paréntesis aquí
    },
    {
      path: '/About',
      name: 'About',
      component: AboutView,  // Sin paréntesis aquí
    },
    {
      path: '/Quiz',
      name: 'Quiz',
      component: QuizView,  // Sin paréntesis aquí
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: ContactView,  // Sin paréntesis aquí
    },
    
  ]
});

export default router;
