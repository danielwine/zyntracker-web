<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";

export default defineComponent({
  name: "LoginCard",
  props: {
    title: String,
  },
  components: { Button },
});
</script>

<template>
  <div class="col-12 col-md-8 col-lg-6">
    <div class="card bg-dark">
      <div class="card-body p-5">
        <form class="mb-3 mt-md-3">
          <h2 class="fw-bold mb-2 text-uppercase">{{ title }}</h2>
          <p class="mb-5">
            <slot name="header"></slot>
          </p>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="name@example.com"
              disabled
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="*******"
              disabled
            />
          </div>
          <p class="small">
            <RouterLink disabled to="" class="text-info"
              >Forgot password?</RouterLink
            >
          </p>
          <div class="mt-4 mb-0 row g-2 w-100">
            <div class="col-xl-4">
              <Button type="submit" caption="Login" :wide="true" disabled />
            </div>
            <slot name="extra"></slot>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
.card {
  border-radius: 0;
}
input.form-control {
  border-radius: 0;
}
</style>
