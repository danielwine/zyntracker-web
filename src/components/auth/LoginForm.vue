<script lang="ts">
import { defineComponent } from "vue";

import Button from "../elements/Button.vue";
import ImportBar from "../app/ImportBar.vue";

export default defineComponent({
  components: { Button, ImportBar },
});
</script>

<template>
  <form class="mb-3 mt-md-3">
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
