<script setup lang="ts">
import { reactive, ref } from "vue";
import Button from "../elements/Button.vue";
import ImportBar from "../app/ImportBar.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter()

let form = reactive({
  email: "",
  password: "",
});
let error = ref("");

const login = async () => {
  await axios.post("/api/login", form).then((response) => {
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      router.push('/')
    } else {
      error.value = response.data.message;
    }
  });
};
</script>

<template>
  <form class="mb-3 mt-md-3">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        v-model="form.email"
        type="email"
        class="form-control"
        id="email"
        placeholder="Enter your Email"
        disabled
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="form-control"
        id="password"
        placeholder="*******"
        disabled
      />
    </div>
    <p class="text-danger" v-if="error">{{ error }}</p>
    <p class="small">
      <RouterLink disabled to="" class="text-info">Forgot password?</RouterLink>
    </p>
    <div class="mt-4 mb-0 row g-2 w-100">
      <div class="col-xl-4">
        <Button type="submit" caption="Login" :wide="true" disabled />
      </div>
      <ImportBar></ImportBar>
    </div>
  </form>
</template>
