import { createApp } from 'vue';
import App from './App.vue';
import HomeFrontComponent from './components/HomeFrontComponent.vue';
import LoginPageComponent from './components/LoginPage.vue';
import RegisterPageComponent from './components/RegisterPage.vue';

import mainpageCombine from './components/MainPage/combineComponent.vue';
import './style.css';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/homelist', component: HomeFrontComponent },
    { path: '/mainpage', component: mainpageCombine },
    { path: '/login', component: LoginPageComponent , props: {imageurl: './src/assets/varinthorncc.png'}},
    { path: '/register', component: RegisterPageComponent, props: {imageurl: './src/assets/varinthorncc.png'}},

  ]
});

const app = createApp(App);
app.use(router);
app.mount('#app');