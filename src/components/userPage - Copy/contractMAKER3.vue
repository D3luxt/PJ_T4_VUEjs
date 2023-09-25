<template>
    <div>
      ทำสัญญา<br>
  
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
            <tr v-for="item in filteredHireData" :key="item.hire_id">
              <td>{{ item.hire_id }}</td>
              <td>{{ item.hire_date }}</td>
              <td>{{ item.hire_status }}</td>
              <td>
                <button>
                  <router-link :to="{ name: 'cMaker', params: { hire_id: item.hire_id } }">
                    ทำการประเมิน
                  </router-link>
                </button>
                <!-- <button @click="confirmAlert(item)">ลบ</button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  components: {},
  data() {
    return {
      selectedComponent: 'home',
      hireData: [],
    };
  },
  computed: {
    filteredHireData() {
      // Filter the hireData array to show only data where hire_status === 'รอทำสัญญา'
      return this.hireData.filter(item => item.hire_status === 'ยืนยันการว่าจ้าง');
    }
  },
  methods: {
    fetchHireData() {
      axios
        .get('http://localhost:3001/hire')
        .then((response) => {
          this.hireData = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchHireData();
  },
};
</script>

