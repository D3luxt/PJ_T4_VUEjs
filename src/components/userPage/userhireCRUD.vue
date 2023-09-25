<template>

  <div class="table-container">
    <table class="table-fixed">
      <thead>
        <tr>
                    <th colspan="4">การว่าจ้าง</th>
                </tr>
        <tr>
          <th>ID</th>
          <th>รหัสบ้าน</th>
          <th>วันนี้ส่งคำว่าจ้าง</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in hireData" :key="item.hire_id" style="margin-bottom: 15em;">
          <td>{{ item.hire_id }}</td>
          <td>{{ item.filehome_id }}</td>
          <td>{{ item.hire_date }}</td>
          <td>{{ item.hire_status }}</td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script>
import axios from 'axios';
import { mapState } from 'vuex';


export default {
  computed: {
    ...mapState(['currentUser']),
  },
  components: {},
  data() {
    return {
      u_id: '',
      selectedComponent: 'home', // Default selected component
      hireData: [], // Renamed the data property to hireData
    };
  },
  methods: {
    fetchHireData() {
      const currentUserUId = this.currentUser.u_id; 
      axios
        .get('http://localhost:3001/hire')
        .then((response) => {
          this.hireData = response.data.filter((item) => item.user_id === currentUserUId);
        })
        .catch((error) => {
          console.error(error);
        });
    }

  },

  mounted() {
    this.fetchHireData(); // Call the renamed method fetchHireData
  },
};
</script>
  
<style scoped>
button {
  font: inherit;
  border: 1px solid #704900;
  background-color: #704900;
  color: white;
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: 15px;
  /* Reduced border radius */
}

button:hover,
button:active {
  border-color: #291700;
  background-color: #291700;
}
</style>