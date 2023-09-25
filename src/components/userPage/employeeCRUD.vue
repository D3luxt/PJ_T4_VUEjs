<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="5">ข้อมูลพนักงาน</th>
                </tr>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>ชื่อ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th><router-link to="/emInsert">
                            เพิ่ม <i class="fa-solid fa-plus fa-2xl" style="color: #007533;"></i>
                        </router-link>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in employee_data" :key="item.em_id">
                    <td>{{ item.em_id }}</td>
                    <td>{{ item.em_email }}</td>
                    <td>{{ item.em_name }}</td>
                    <td>{{ item.em_username }}</td>
                    <td>
                        <router-link :to="{ name: 'emUpdate', params: { em_id: item.em_id } }"><i class="fa-regular fa-pen-to-square fa-2xl" style="color: #bd8a00;"></i></router-link>       
                        &nbsp;
                        <i class="fa-solid fa-xmark fa-2xl" style="color: #ff0000;" @click="confirmAlert(item)"></i>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components: {
    },
    data() {
        return {
            selectedComponent: 'home', // Default selected component
        };
    },
    data() {
        return {
            employee_data: [],
        };
    },
    methods: {
        confirmAlert(item) {
            this.$swal.fire({
                title: 'ยืนยัน',
                text: "ต้องการลบหรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteItem(item);
                    this.$swal.fire(
                        'ลบเรียบร้อย!',
                        'ต้องการลบหรือไม่',
                        'success'
                    )
                }
            })
        },
        deleteItem(item) {
            axios.delete(`http://localhost:3001/employee/${item.em_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.employee_data = this.employee_data.filter(data => data.em_id !== item.em_id);
                    console.log('Item deleted:', item.em_id);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        fetchfilehome_data() {
            axios.get('http://localhost:3001/employee')
                .then(response => {
                    this.employee_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },

    mounted() {
        this.fetchfilehome_data();
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