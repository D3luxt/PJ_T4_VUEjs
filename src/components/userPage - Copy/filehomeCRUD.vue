<template>
    แบบบ้าน<button class="ADDButton"><router-link to="/fhInsert">เพิ่ม</router-link></button><br>

    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ชื่อ</th>
                    <th>แก้ไข</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filehome_data" :key="item.filehome_id">
                    <td>{{ item.filehome_id }}</td>
                    <td>{{ item.filehome_name }}</td>
                    <td><button class="EDITButton" ><router-link :to="{ name: 'fhUpdate', params: { filehome_id: item.filehome_id } }">
                            แก้ไข
                        </router-link>
                    </button>
                        <button class="DELETEButton" @click="confirmAlert(item)">ลบ</button>
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
            filehome_data: [],

        };
    },
    methods: {
        confirmAlert(item) {
            if (confirm("ต้องการลบหรือไม่?")) {
                this.deleteItem(item);
            }
        },
        fetchfilehome_data() {
            axios.get('http://localhost:3001/filehome')
                .then(response => {
                    this.filehome_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        deleteItem(item) {
            axios.delete(`http://localhost:3001/filehome/${item.filehome_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.filehome_data = this.filehome_data.filter(data => data.filehome_id !== item.filehome_id);
                    console.log('Item deleted:', item.filehome_id);
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