import { ref } from "vue";
import { apiBaseUrl } from "./config";
import { useMainStore } from "@/stores/zss";
import error from "./error";
import axios from "axios";

const main = useMainStore();
axios.defaults.baseURL = apiBaseUrl;

export interface ApiResponse {
  data: [];
}

/**
 * Composable for sending API requests
 */
export default function useAPI(endpoint = "item") {
  const items = ref([]);
  const item = ref([]);
  const errors = ref({});

  const index = async () => {
    try {
      const response = await axios.get(endpoint);
      items.value = response.data.data;
    } catch (err: unknown) {
      if (
        err instanceof axios.AxiosError &&
        err.code == axios.AxiosError.ERR_BAD_REQUEST
      ) {
        errors.value = err.response?.data.errors;
        main.error.message = error.server;
      }
    }
  };
  const show = async (id: number) => {
    const response = await axios.get(endpoint + "/" + id);
    item.value = response.data.data;
  };
  const store = async (data: any) => {
    try {
      await axios.post(endpoint, data);
    } catch (err: any) {
      if (err.response.status === 422) {
        errors.value = err.response.data.errors;
      }
    }
  };
  const update = async (id: number) => {
    try {
      await axios.put(endpoint + "/" + id, item.value);
    } catch (err: any) {
      if (err.response.status === 422) {
        errors.value = err.response.data.errors;
      }
    }
  };
  const destroy = async (id: number) => {
    await axios.delete(endpoint + "/" + id);
    await index();
  };
  return {
    items,
    item,
    index,
    show,
    store,
    update,
    destroy,
  };
}
