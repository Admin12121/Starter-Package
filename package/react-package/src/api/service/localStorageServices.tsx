import  secureLocalStorage  from  "react-secure-storage";
import { jwtVerify, JWTPayload } from 'jose';

const jwtSecret = new TextEncoder().encode(`${import.meta.env.VITE_KEY_ENCRYPTION_KEY}`);

interface Token {
  access: string;
  refresh: string;
}

interface DecodedToken extends JWTPayload {
  role?: string;
}

const storeToken =  async (value: Token) => {
  if (value) {
    const { access, refresh } = value;
    secureLocalStorage.setItem("access_token", access);
    secureLocalStorage.setItem("refresh_token", refresh);

    try {
      const { payload } = await jwtVerify(access, jwtSecret) as { payload: DecodedToken };
      const role = payload.role;
      if (role) {
        secureLocalStorage.setItem("user_role", role);
      }
    } catch (error) {
      console.error("Error verifying or decoding token:", error);
    }
  }
};

const getToken = () => {
  let access_token = secureLocalStorage.getItem("access_token");
  let refresh_token = secureLocalStorage.getItem("refresh_token");
  let user_role = secureLocalStorage.getItem("user_role");
  return { access_token, refresh_token, user_role };
};

const removeToken = () => {
  secureLocalStorage.removeItem("access_token");
  secureLocalStorage.removeItem("refresh_token");
  secureLocalStorage.removeItem("user_role");
};

export { storeToken, getToken, removeToken };
