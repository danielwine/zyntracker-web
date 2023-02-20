import { ref } from "vue";
import { apiBaseUrl } from "./config";
import axios from "axios";
import { useUIStore } from "@/stores/ui";
import useUtils from "./util";

export interface User {
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface ValidationErrors {
  [key: string]: any;
}

/**
 * Composable for Authentication
 */
export default function useAuth() {
  let processing = ref(false);
  let validationErrors: ValidationErrors = ref({});

  const register = async (user: User) => {
    processing.value = true;
    await axios
      .post(apiBaseUrl + "/register", user)
      .then((response) => {
        useUIStore().loggedin = true;
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          validationErrors.value = response.data.errors;
        } else {
          alert(response.data.message);
        }
      })
      .finally(() => {
        processing.value = false;
      });
  };

  const login = async (user: User) => {
    processing.value = true;
    await axios
      .post(apiBaseUrl + "/login", user)
      .then((response) => {
        sessionStorage.setItem("token", response.data.token);
        useUIStore().loggedin = true;
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          validationErrors.value = response.data.errors;
        } else {
          alert(response.data.message);
        }
      })
      .finally(() => {
        processing.value = false;
      });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    useUIStore().loggedin = false;
    useUtils().reset();
  };

  return {
    validationErrors,
    register,
    login,
    logout,
  };
}
