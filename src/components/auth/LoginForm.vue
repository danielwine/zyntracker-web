<script setup lang="ts">
import { ref } from "vue";
import Button from "../elements/Button.vue";
import ImportBar from "../app/ImportBar.vue";
import useAuth from "@/composables/auth";

let user = ref({
  email: "",
  password: "",
});

const { validationErrors, login } = useAuth();
</script>

<template>
  <form @submit.prevent="login(user)" class="mb-3 mt-md-3">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        v-model="user.email"
        type="email"
        class="form-control"
        id="email"
        placeholder="Enter your Email"
        required
      />
      <div v-if="validationErrors['email']">
        <span class="text-danger">{{ validationErrors["email"][0] }}</span>
      </div>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="user.password"
        type="password"
        class="form-control"
        id="password"
        placeholder="*******"
        required
      />
      <div v-if="validationErrors['password']">
        <span class="text-danger">{{ validationErrors["password"][0] }}</span>
      </div>
    </div>
    <p class="small">
      <RouterLink disabled to="" class="text-info">Forgot password?</RouterLink>
    </p>
    <div class="mt-4 mb-0 row g-2 w-100">
      <div class="col-xl-4">
        <Button type="submit" caption="Login" :wide="true" />
      </div>
      <ImportBar></ImportBar>
    </div>
  </form>
</template>
