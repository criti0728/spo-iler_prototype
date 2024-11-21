<template>
  <div class="body-text">
    <div class="title">Welcome to Spo-iler!</div>
    <div class="sub-title">Make amazing experiences by our AI prediction service!</div>
  
    <!-- 로그인 안했을 때 화면 -->
    <div class="buttons" v-if="!currentUser">
      <router-link to="/register" class="nav-link">
        <button type="button" class="btn btn-primary">Sign Up</button>
      </router-link>
      <router-link to="/login" class="nav-link">
        <button type="button" class="btn btn-primary">Sign In</button>
      </router-link>
    </div>

    <!-- 로그인 했을 때 화면 -->
    <div class="buttons" v-if="currentUser">
      <router-link to="/user" class="nav-link">
        <button type="button" class="btn btn-primary">Start</button>
      </router-link>
      <router-link to="/profile" class="nav-link">
        <button type="button" class="btn btn-primary">My Page</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Home",
  data() {
    return {
      content: "이게 보이면 머가 잘못된거임",
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
};
</script>

<style scoped>
*{
  font-family: 'Poppins', sans-serif;
}

.body-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  padding: 0 30px;
}
.body-text div{
  font-size: 45px;
  font-weight: 600;
}
.body-text .sub-title {
  font-size: 30px;
}
.buttons {
  display: flex;
  justify-content: center;
}
</style>