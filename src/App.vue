<template>
  <header-component :title="title" :imageurl="imageurl" :profileurl="profileurl"
    style="font-family: Prompt; font-size: large;"></header-component>
  <main>
    <router-view></router-view>
  </main>
  <footer-component :title="title" :footertext="footertext" :imageurl="imageurl"
    style="font-family: Prompt; font-size: large;"></footer-component>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import HomeFrontComponent from './components/HomeFrontComponent.vue';
import FirstContentComponent from './components/MainPage/FirstContentComponent.vue';
import SecondContentComponent from './components/MainPage/SecondContentComponent.vue';
import RegisterPageComponent from './components/RegisterPage.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    HomeFrontComponent,
    FirstContentComponent,
    SecondContentComponent,
    FooterComponent,
    RegisterPageComponent,
  },
  data() {
    return {
      imageurl: './src/assets/varinthorncc.png',
      profileurl: './src/assets/profilepic.png',
      title: 'Varinthorn C&C',
      footertext:'ติดต่อเรา เบอร์โทรศัพท์ : 065-XX5-XXX1 Facebook : วรินทรรับเหมาก่อสร้าง',
    };
  },
};

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Prompt');
</style>
