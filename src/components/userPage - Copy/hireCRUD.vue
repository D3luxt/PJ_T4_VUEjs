<template>
  การว่าจ้าง<br>

  <div class="table-container">
    <table class="table-fixed">
      <thead>
        <tr>
          <th>ID</th>
          <th>วันนี้ส่งคำว่าจ้าง</th>
          <th>ID การจ้างงาน</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in hireData" :key="item.hire_id" style="margin-bottom: 15em;">
          <td>{{ item.hire_id }}</td>
          <td>{{ item.hire_date }}</td>
          <td>{{ item.hire_status }}</td>
          <td>
            <button class="ADDButton" v-if="item.hire_status === 'ยังไม่ทำการประเมิน'">
              <router-link :to="{ name: 'apInsert', params: { hire_id: item.hire_id } }">
                ทำการประเมิน
              </router-link>
            </button>
            <!-- <button @click="confirmAlert(item)">ลบ</button> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  components: {},
  data() {
    return {
      selectedComponent: 'home', // Default selected component
      hireData: [], // Renamed the data property to hireData
    };
  },
  methods: {
    fetchHireData() {
      axios
        .get('http://localhost:3001/hire')
        .then((response) => {
          this.hireData = response.data; // Remove the parentheses after response.data
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
  border-radius: 15px; /* Reduced border radius */
}

button:hover,
button:active {
  border-color: #291700;
  background-color: #291700;
}
</style>