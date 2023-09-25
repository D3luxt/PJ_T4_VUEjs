<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="7">ไฟล์แบบบ้าน</th>
                </tr>
                <tr>
                    <th>ID</th>
                    <th>ชื่อไฟล์ PDF</th>
                    <th>รายละเอียดไฟล์แบบบ้าน</th>
                    <th>สเกล</th>
                    <th>บ้านที่อ้างอิง</th>
                    <th>ดาวน์โหลด</th>
                    <th><router-link to="/phINSERT">
                            เพิ่ม <i class="fa-solid fa-plus fa-2xl" style="color: #007533;"></i>
                        </router-link></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in planhome" :key="item.planhome_id">
                    <td>{{ item.planhome_id }}</td>
                    <td>{{ item.planhome_pdf }}</td>
                    <td>{{ item.planhome_details }}</td>
                    <td>{{ item.planhome_scale }}</td>
                    <td>{{ item.filehome_id }}</td>
                    <td>
                    <i class="fa-solid fa-download fa-2xl" style="color: #00c220;" @click="downloadplanhomePdf(item.planhome_pdf)"></i>
                  </td>
                    <td>
                        <router-link :to="{ name: 'phUpdate', params: { planhome_id: item.planhome_id } }"><i
                                class="fa-regular fa-pen-to-square fa-2xl" style="color: #bd8a00;"></i></router-link>
                        <i class="fa-solid fa-xmark fa-2xl" style="color: #ff0000;" @click="confirmAlert(item)"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <iframe :src="pdfURL" class="pdf-iframe"></iframe>
    
</template>

<script>

import axios from 'axios';

export default {
    components: {
    },
    data() {
        return {
            selectedComponent: 'home', // Default selected component
            planhome: [],

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
        fetchplanhome_data() {
            axios.get('http://localhost:3001/planhome')
                .then(response => {
                    this.planhome = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        async downloadplanhomePdf(planhome_pdf) {
            try {

                const pdfResponse = await axios.get(`http://localhost:3001/get_pdf/${planhome_pdf}`, {
                    responseType: 'arraybuffer',
                });

                // Create a blob with the PDF data
                const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });

                // Generate a temporary URL for the blob
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Create an anchor element to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = pdfUrl;
                downloadLink.download = `${planhome_pdf}.pdf`; // Set the desired filename for the download

                // Simulate a click on the anchor element to trigger the download
                downloadLink.click();

                // Clean up by revoking the object URL
                URL.revokeObjectURL(pdfUrl);
            }


            catch (error) {
                console.error('Error downloading PDF:', error);
            }

        },

        deleteItem(item) {
            axios.delete(`http://localhost:3001/planhome/${item.planhome_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.planhome = this.planhome.filter(data => data.planhome_id !== item.planhome_id);
                    console.log('Item deleted:', item.planhome_id);
                })
                .catch(error => {
                    console.error(error);
                });
        },

    },

    mounted() {
        this.fetchplanhome_data();
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