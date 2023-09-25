<template>
  <div class="table-container">
    <table class="table-fixed">
      <thead>
        <tr>
          <th colspan="6">การว่าจ้าง</th>
        </tr>
        <tr>
          <th>ID</th>
          <th>วันนี้ส่งคำว่าจ้าง</th>
          <th>สถานะ</th>
          <th>ทำการประเมิน หรือ แก้ไข</th>
          <th>PDF</th>
          <th>ยืนยันการประเมิน</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in hireData" :key="item.hire_id" style="margin-bottom: 15em;">
          <td>{{ item.hire_id }}</td>
          <td>{{ item.hire_date }}</td>
          <td>{{ item.hire_status }}</td>
          <td>
            <router-link :to="{ name: 'apInsert', params: { hire_id: item.hire_id } }">
              <i class="fa-regular fa-pen-to-square fa-2xl" style="color: #bd8a00;"></i>
            </router-link>
            <!-- <a :href="getPDFFileURL(item.ap_pdf)" target="_blank"><i class="fa-solid fa-file-arrow-down fa-2xl" style="color: #4dff00;"></i></a> -->
          </td>
          <td v-if="item.hire_status == 'รอส่งการยืนยัน'">
            <a :href="getPDFFileURL(item.hire_id)" target="_blank">
              <i class="fa-solid fa-file-arrow-down fa-2xl" style="color: #fe0000;"></i>
            </a>
          </td>
          <td v-if="item.hire_status == 'รอส่งการยืนยัน'">
            <i class="fa-solid fa-paper-plane fa-2xl" style="color: #66ff00;" @click="confirmAlert(item)"></i>
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
    confirmAlert(item) {
      this.$swal.fire({
        title: 'ยืนยัน',
        text: "ต้องการส่งใบประเมินหรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmItem(item);
          this.$swal.fire(
            'ส่งเรียบร้อย!',
            'ต้องการส่งใบประเมินหรือไม่',
            'success'
          )
        }
      })
    },
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
    getPDFFileURL(hireId) {
      // Modify the base URL according to your server's URL
      return `http://localhost:3001/get_apppdf/${hireId}.pdf`;
    },
    confirmItem(item) {
      // Define the data you want to update
      const hire_status = 'ส่งคำร้องสำเร็จ';
      axios
        .put(`http://localhost:3001/hire/${item.hire_id}`, { hire_status }) // Send hire_status as an object
        .then((response) => {
          // Handle the response and update your data as needed
          console.log(`Item updated: ${item.hire_id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }


    // fetchappraise_data() {
    //         axios
    //             .get('http://localhost:3001/appraise')
    //             .then(response => {
    //                 this.appraise_data = response.data.filter(item => {
    //                     return hire_data.some(hireItem => hireItem.hire_id === item.hire_id);
    //                 });

    //             })
    //             .catch(error => {
    //                 console.error(error);
    //             });
    //     },
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