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
        placeholder="Enter your Email"
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
    <div class="mt-4 mb-0 row g-2 w-100">
      <div class="col-xl-12">
        <Button type="submit" caption="Register" :wide="true" disabled />
      </div>
    </div>
  </form>
</template>
