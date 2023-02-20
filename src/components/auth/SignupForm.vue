<script setup lang="ts">
import useAuth from "@/composables/auth";
import { ref } from "vue";
import Button from "../elements/Button.vue";

let user = ref({
  email: "",
  password: "",
  password_confirmation: "",
});

const { validationErrors, register } = useAuth();
</script>

<template>
  <form @submit.prevent="register(user)" class="mb-3 mt-md-3">
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
    <div class="mb-3">
      <label for="password-confirmation" class="form-label"
        >Password confirmation</label
      >
      <input
        v-model="user.password_confirmation"
        type="password"
        class="form-control"
        id="password-confirmation"
        placeholder="*******"
        required
      />
    </div>
    <div class="mt-4 mb-0 row g-2 w-100">
      <div class="col-xl-12">
        <Button type="submit" caption="Register" :wide="true" />
      </div>
    </div>
  </form>
</template>
