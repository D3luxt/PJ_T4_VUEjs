<template>
  <header class="bg-neutral-500 sticky top-0 z-50">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a class="flex items-center">
          <img :src="defaultImageURL" class="h-8 mr-3" alt="Varinthorn Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"> {{ company_data.length > 0 ? company_data[0].com_name_en : '' }}
 </span>

        </a>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
          <ul
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <router-link to="/"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">หน้าหลัก</router-link>
            </li>
            <li>
              <router-link to="/homelist"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">แบบบ้าน</router-link>
            </li>
          </ul>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-3">
          <ul
            class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">


            <li v-if="currentUser">
              <div class="flex items-center">

                <router-link :to="'/Account/'"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  {{ extractName(currentUser.u_email) }}
                </router-link>
                <a @click="confirmLogout"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">ออกจากระบบ</a>
              </div>
            </li>
            <li v-else>
            <li v-if="currentEmployee">
              <div class="flex items-center">
                <span style="margin-left: 20px;">ผู้ดูแลระบบ</span> 🛠️ :
                <router-link :to="'/Account/'"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  {{ extractName(currentEmployee.em_email) }}
                </router-link>
                <a @click="confirmLogout"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">ออกจากระบบ</a>
              </div>
            </li>
            <li v-else>


              <div class="flex items-center">
                <router-link to="/login"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">เข้าสู่ระบบ</router-link>
                <router-link to="/register"
                  class="block ml-4 py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">สมัครสมาชิก</router-link>
              </div>
            </li>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>







<script>
import { mapGetters } from 'vuex';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

export default {
  name: 'Header',
  computed: {
    ...mapGetters(['getCurrentUser', 'getCurrentEmployee']),
  },
  data() {
    return {
      currentUser: null,
      currentEmployee: null,
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      isMenuOpen: false,
      company_data: [],

    };
  },
  methods: {
    fetchcompany_data() {
            axios.get('http://localhost:3001/company')
                .then(response => {
                    this.company_data = response.data;
                    console.log(this.company_data);
                })
                .catch(error => {
                    console.error(error);
                });
        },
    confirmLogout() {
      this.$swal.fire({
        title: 'ยืนยัน',
        text: "ยืนยันการออกจากระบบ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout()
        }
      })
    },
    extractName(email) {
      const atIndex = email.indexOf('@');
      if (atIndex !== -1) {
        return email.substring(0, atIndex);
      }
      return email;
    },
    logout() {
      const userId = this.getCurrentUser ? this.getCurrentUser.u_id : null;
      const employeeId = this.getCurrentEmployee ? this.getCurrentEmployee.em_id : null;

      // Implement your logout logic here
      // For example, clear the access token from local storage and redirect to the login page
      localStorage.removeItem('accessToken');
      this.currentUser = null;
      this.currentEmployee = null;
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchcompany_data()
    // Check if the user is already logged in by retrieving the access token from local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // Decode the token to extract user information
        const decodedToken = jwt_decode(token);
        // Assuming you have an employee field in the token
        this.currentUser = decodedToken.user;
        this.currentEmployee = decodedToken.employee;
      } catch (error) {
        console.error('Failed to decode token:', error);
        // Handle error decoding token, e.g., token is invalid or expired
        // You can redirect to the login page or show an error message
      }
    }
  },
};
</script>

<style>
/* Add your existing styles here */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.2s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  max-height: 0;
  overflow: hidden;
}
</style>
