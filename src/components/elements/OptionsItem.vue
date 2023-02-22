<script setup lang="ts">
import { computed } from "@vue/reactivity";

const props = defineProps({
  label: String,
  id: String,
  value: [Number, Boolean],
});

const isNumber = computed(() => {
  return typeof props.value == "number";
});

const isBoolean = computed(() => {
  return typeof props.value == "boolean";
});

const getId = computed(() => {
  return isBoolean ? "switch-" + props.id : "range-" + props.id;
});
</script>

<template>
  <div class="row ms-3 mb-1" :class="isBoolean ? 'form-check form-switch' : ''">
    <div class="col-8">
      <label class="form-label" :for="getId">{{ label }}</label>
    </div>
    <div class="col-4">
      <input
        :class="isBoolean ? 'form-check-input' : 'form-range'"
        :type="isBoolean ? 'checkbox' : 'range'"
        :value="value"
        :checked="typeof value == 'boolean' ? value : 'false'"
        :id="getId"
        disabled
      />
    </div>
  </div>
</template>
<style>

.form-label {
  margin-right: 2em;
}

.form-range {
  width: 50%;
}

.form-check {
  display: flex;
}

.form-switch {
  padding-left: 0;
}

.form-check .form-check-input {
  float: left;
  margin-left: 0em;
  /* margin-right: 50%; */
}

.form-switch .form-check-input {
  width: 3em;
  height: 1.1em;
}
</style>
