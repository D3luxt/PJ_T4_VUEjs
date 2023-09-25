import { createApp } from 'vue';
import App from './App.vue';
import HomeFrontComponent from './components/HomeFrontComponent.vue';
import LoginPageComponent from './components/LoginPage.vue';
import RegisterPageComponent from './components/RegisterPage.vue';
import HomeDetailsComponent from './components/HomeDetails.vue';
import combineuserPage from './components/userPage/combineuserPage.vue';
import mainpageCombine from './components/MainPage/combineComponent.vue';
import planhomeINSERT from './components/userPage/planhomeINSERT.vue';
import filehomeINSERT from './components/userPage/filehomeINSERT.vue';
import filehomeUPDATE from './components/userPage/filehomeUPDATE.vue';
import './style.css';
import { createRouter, createWebHistory } from 'vue-router';
import materialINSERT from './components/userPage/materialINSERT.vue';
import materialUpdate from './components/userPage/materialUPDATE.vue';
import appraiseInsert from './components/userPage/appraiseINSERT.vue';
import appraiseUpdate from './components/userPage/appraiseUpdate.vue';
import RegisterEmployeePage from './components/userPage/RegisterEmployeePage.vue';
import contactMAKER4 from './components/userPage/contactMAKER4.vue';
import employeeUPDATE from './components/userPage/employeeUPDATE.vue';
import companyUPDATE from './components/userPage/companyUPDATE.vue';
import customerUPDATE from './components/userPage/customerUPDATE.vue';
import planhomeUPDATE from './components/userPage/planhomeUPDATE.vue';

// Import Vuex and setup the store
import Vuex from 'vuex';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { mapState } from 'vuex';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.css';


const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentEmployee: null,
  },
  mutations: {
    setFilehomeData(state, data) {
      state.filehome_data = data;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_CURRENT_EMPLOYEE(state, employee) {
      state.currentEmployee = employee;
    },
    RESET_CURRENT(state) {
      state.currentUser = null;
      state.currentEmployee = null;
    },
  },
  actions: {
    setCurrentUser({ commit, state }, user) {
      // Check if there is a current employee, if yes, reset it
      if (state.currentEmployee) {
        commit('SET_CURRENT_EMPLOYEE', null);
      }
      commit('SET_CURRENT_USER', user);
      console.log('User is logged in:', user);
    },
    setCurrentEmployee({ commit, state }, employee) {
      // Check if there is a current user, if yes, reset it
      if (state.currentUser) {
        commit('SET_CURRENT_USER', null);
      }
      commit('SET_CURRENT_EMPLOYEE', employee);
      console.log('Employee is logged in:', employee);
    },
    resetCurrent({ commit }) {
      // Use this action to reset both current user and current employee
      commit('RESET_CURRENT');
    },
  },
  getters: {
    getCurrentUser(state) {
      return state.currentUser;
    },
    getCurrentEmployee(state) {
      return state.currentEmployee;
    },
  },
});

// Check if the user is already logged in by retrieving the access token from local storage
const token = localStorage.getItem('accessToken');
if (token) {
  try {
    // Decode the token to extract user information
    const decodedToken = jwt_decode(token);
    console.log('Frontend Time:', new Date().toISOString());
    console.log('Decoded token payload:', decodedToken); // Log the decoded token payload
    console.log('Decoded token role:', decodedToken.role);


    // Check if the decoded token contains user information
    if (decodedToken.role === 'user') {
      store.dispatch('setCurrentUser', decodedToken.user);
    } else if (decodedToken.role === 'employee') {
      store.dispatch('setCurrentEmployee', decodedToken.employee); // Corrected line
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
    // Handle error decoding token, e.g., token is invalid or expired
    // You can redirect to the login page or show an error message
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/homelist/:filehome_id', name: 'homelist', component: HomeDetailsComponent, props: true },
    { path: '/homelist', component: HomeFrontComponent },
    { path: '/', component: mainpageCombine },
    { path: '/login', component: LoginPageComponent },
    { path: '/register', component: RegisterPageComponent },
    { path: '/Account', component: combineuserPage },
    { path: '/phINSERT', component: planhomeINSERT },
    { path: '/phUpdate/:planhome_id', name: 'phUpdate', component: planhomeUPDATE },
    { path: '/fhInsert', component: filehomeINSERT },
    { path: '/fhUpdate/:filehome_id', name: 'fhUpdate', component: filehomeUPDATE },
    { path: '/mtInsert', component: materialINSERT },
    { path: '/apInsert/:hire_id', name:'apInsert', component:appraiseInsert },
    { path: '/mtUpdate/:material_id', name: 'mtUpdate', component: materialUpdate },
    { path: '/apUpdate/:ap_id', name: 'apUpdate', component: appraiseUpdate },
    { path: '/emUpdate/:em_id', name: 'emUpdate', component: employeeUPDATE },
    { path: '/ctUpdate/:u_id', name: 'ctUpdate', component: customerUPDATE },
    { path: '/cmUpdate/:com_id', name: 'cmUpdate', component: companyUPDATE },
    { path: '/contractMaker/:hire_id', name:'cMaker', component: contactMAKER4 },
    { path: '/emInsert', component: RegisterEmployeePage },

  ]
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  console.log('Token:', token);

  // Check if the user is logged in (token exists)
  if (token) {
    // If token exists, the user or employee is logged in
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Check if the requested path is '/login'
    if (to.path === '/login') {
      // Redirect to the home page or any other appropriate page
      next('/');
    } else {
      // Allow navigation to the requested page
      next();
    }
  } else {
    // If token doesn't exist, the user or employee is not logged in
    delete axios.defaults.headers.common['Authorization']; // Remove the JWT token from request headers

    // Allow navigation to the login page
    next();
  }
});




// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('accessToken');
//   console.log('Token:', token);
//   const isLoginPage = to.path === '/login';

//   if (token) {
//     // If token exists, the user or employee is logged in
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     if (isLoginPage) {
//       // Redirect to the home page or any other appropriate page
//       next('/');
//     } else {
//       // Allow navigation to the requested page
//       next();
//     }
//   } else {
//     // If token doesn't exist, the user or employee is not logged in
//     delete axios.defaults.headers.common['Authorization']; // Remove the JWT token from request headers
//     if (isLoginPage) {
//       // Allow navigation to the login page
//       next();
//     } else {
//       // Redirect to the login page or any other appropriate page
//       next('/login');
//     }
//   }
// });


const app = createApp(App);
app.config.globalProperties.$swal = Swal;
app.use(store); // Use the Vuex store
app.use(router);
app.mount('#app');

