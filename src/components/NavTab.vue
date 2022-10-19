<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tabList: {
      type: Array,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: () => "vertical",
      validator: (value: string) => ["horizontal", "vertical"].includes(value),
    },
  },
  data() {
    return {
      activeTab: 1,
      id: 123,
    };
  },
});
</script>

<template>
  <div
    class="tabs-container"
    :class="{
      'container-horizontal': variant === 'horizontal',
    }"
  >
    <ul
      class="tabs"
      :class="{
        'container-vertical': variant === 'vertical',
      }"
    >
      <li
        v-for="(tab, index) in tabList"
        :key="index"
        :class="{
          active: index + 1 === activeTab,
          inactive: index + 1 !== activeTab,
        }"
      >
        <label :for="`${id}${index}`" v-text="tab" />
        <input
          :id="`${id}${index}`"
          type="radio"
          :name="`${id}-tab`"
          :value="index + 1"
          v-model="activeTab"
        />
      </li>
    </ul>
    <template v-for="(tab, index) in tabList">
      <div
        :key="index"
        v-if="index + 1 === activeTab "
        class="tab-panel"
      >
      <!-- && windowWidth < 992 -->
        <slot :name="`tabPanel-${index + 1}`" />
      </div>
    </template>
  </div>
</template>

<style>
.tabs-container {
  /* w-11/12 lg:w-10/12 mx-auto mb-16 */
  margin-left: auto;
  margin-right: auto;
  margin: 0 auto 0em auto;
  background-color: #333;
}

.container-horizontal {
  /* flex space-x-4 */
  display: flex;
}
ul.container-vertical {
  display: flex;
  align-items: center;
  margin-bottom: 0em;
}

.tabs {
  list-style: none;
  background-color: #333;
  padding: 0.5em 0 0em 0;
  text-align: center;
  overflow: auto;
  white-space: nowrap;
  border-radius: 0;
}

.tabs input {
  visibility: hidden;
}

.tabs label {
  cursor: pointer;
  padding: 0.75em 1.8em 0.75em 1.8em;
  /* display: block; */
}

.tabs li {
  width: 100%;
  /* padding: 0.5em 1.5em 0.5em 1.5em; */
  border-radius: 0;
  /* border: 1px solid white; */
}

.tabs li.active {
  color: black;
  background-color: white;
}

.tabs li.inactive {
  color: white;
  background-color: #555;
}

.tab-panel {
  flex-grow: 1;
  /* background: #333; */
  background: black;
  border-radius: 0;
  padding: 10px 10px 6px 14px;
  height: 305px;
  overflow: hidden;
}
</style>
