<template>
  <!-- 프로필 정보 -->
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-7">
        <div class="card p-3 py-4">
          <div class="text-center">
            <img src="../assets/person-icon.png" width="100" class="rounded-circle">
          </div>
          <div class="text-center mt-3">
            <span class="bg-secondary p-1 px-4 rounded text-white">{{ currentUser.roles[0].slice(5) }}</span>
            <h3 class="mt-2 mb-0">{{currentUser.username}}</h3>
            <div class="px-4 mt-1">
              <span>{{currentUser.email}}</span>
              <p class="fonts">{{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}</p>
            </div>
            <div class="buttons">
                <button class="btn btn-outline-primary px-4"><router-link to="/user" class="nav-link">Start</router-link></button>
                <button class="btn btn-primary px-4 ms-3"><a id="logout" class="nav-link" @click.prevent="logOut">LogOut</a></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  <!-- 분석 히스토리 -->
  <div class="container px-4 py-5 mx-auto">
    <!-- 테이블 헤더 -->
    <div class="row d-flex justify-content-center">
      <div class="col-5">
        <h4 class="heading">Analysis History</h4>
        <span>Reset upon logging out.</span>
      </div>
      <div class="col-7">
        <div class="row text-right">
          <div class="col-5">
            <h6 class="mt-2">Estimated Win Probability</h6>
          </div>
          <div class="col-6">
            <h6 class="mt-2">Date</h6>
          </div>
        </div>
      </div>
    </div>
    <!-- 테이블 행 -->
    <div v-for="(log, index) in logs.slice().reverse()" :key="index" class="row d-flex justify-content-center border-top">
      <div class="col-5">
        <div class="row d-flex">
          <div class="face">
            <img v-if="log.imageUrl" :src="log.imageUrl" alt="Uploaded Image" style="max-width: 100px;" class="face-img">
          </div>
        </div>
      </div>
      <div class="my-auto col-7">
        <div class="row text-right">
          <div class="col-5">
            <h6 class="mob-text">
              <p v-if="log.winProbability">{{ log.winProbability }}%</p>
            </h6>
          </div>          
          <div class="col-6">
            <p class="mob-text">{{ formatTimestamp(log.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFromLocalStorage } from "../utils/storage";

export default {
  data() {
    return {
      logs: [],
    };
  },
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.logs = getFromLocalStorage("userLogs");
  },
  methods: {
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };
        return date.toLocaleString('en-US', options);
      },
      logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
      window.localStorage.removeItem('userLogs');
      },
  },
};
</script>

<style scoped>
.border-top {
  border-top: 1px solid #EEEEEE !important;
  margin-top: 20px;
  padding-top: 15px;
}

.card{
  border:none;
  
}

.card:before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  border-width: 4px;
  border-color: lightgray;
  border-style: solid;
  border-radius: 8px;
}

.card:after{
  content:"";
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  border-width: 4px;
  border-color: black;
  border-style: solid;
  border-radius: 8px;
  transform:scale(0, 0);
  transition:all 0.3s;
  transform-origin: top, left;
}

.card:hover::after{
  transform:scale(1, 1);
}

.fonts{
  font-size:10px;
}

.buttons button:nth-child(1){
  position: relative;
  border:1px solid #3030ff !important;
  color:#ffffff;
  height:40px;
  background-color: #3030ff;
  z-index: 1;
}

.buttons button:nth-child(1):hover{
  border:1px solid #0000ff !important;
  color:#fff;
  height:40px;
  background-color:#0000ff;
}

.buttons button:nth-child(2){
  position: relative;
  border:1px solid #a0a0a0 !important;
  background-color:#fff;
  color:#000000;
  height:40px;
  z-index: 1;
}

.buttons button:nth-child(2):hover{
  border:1px solid #000000 !important;
  background-color:#fff;
  color:#000000;
  height:40px;
}

.nav-link {
  color: inherit; 
  text-decoration: none;
  top: 50%;
  transform: translate(0, -50%);
  position: relative;
}
</style>