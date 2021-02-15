import { getConfig } from "./helpers";
import { sendFormData } from "./rpc";

const localStorageEvent = new Event("localStorageEvent");
const dispatchEvent = () => {
  document.dispatchEvent(localStorageEvent);
};

const setItem = (name, value, persist) => {
  if (persist) {
    localStorage.setItem(name, value);
  } else {
    sessionStorage.setItem(name, value);
  }
};

export const getItem = (name) => {
  return sessionStorage.getItem(name) || localStorage.getItem(name);
};

export const isAuthorized = () => {
  return Boolean(getItem("token"));
};

export const isProfileExist = () => {
  return getItem("profileId") > 0;
};

export const getUsername = () => {
  return getItem("userName");
};

export const getToken = () => {
  return getItem("token") || "";
};

export const getClaims = () => {
  return getItem("claims") || "";
};

export const authenticate = ({ userName, token, userId, claims, login, persist }) => {
  setItem("userName", userName ? userName : '', persist);
  setItem("token", token, persist);
  setItem("login", login, persist);
  setItem("userid", userId, persist);
  setItem("claims", claims, persist);
  
  if (global && global.__audit) {
    const config = getConfig();
    const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
    const auditProvider = new global.__audit({
      baseUrl: BASE_URL,
      login: userName,
      token: token,
      app_id: "mlk",
    });

    auditProvider.single("Authorize", "вход пользователя");
  }
};

export const auth = async ({
  login,
  password,
  persist = false,
  onDisabled = () => {},
  onSuccess = () => {},
  onError = () => {},
}) => {
  var formData = new FormData();
  formData.append("UserName", login);
  formData.append("Password", password);
  try {
    const responce = await sendFormData("auth", formData);
    if (responce.user.b_disabled) {
      onDisabled();
    } else {
      authenticate({
        userName: responce.user.userName,
        token: responce.token,
        userId: responce.user.userId,
        persist: persist,
        claims: responce.user.claims,
        login: login
      });
      onSuccess();
    }
  } catch (error) {
    onError(error);
  }
};

export const getUserId = () => {
  return Number.parseInt(getItem("userid"));
};

export const logout = () => {
  setItem("userName", "");
  setItem("token", "");
  setItem("userid", "");
  setItem("claims", "");
  setItem("login", "");

  setItem("userName", "", true);
  setItem("token", "", true);
  setItem("userid", "", true);
  setItem("claims", "", true);
  setItem("login", "", true);
  dispatchEvent();
};

export function formatFIO(lastname, firstname, patronymic, min = false) {
  let _firstname = firstname ? firstname : "";
  const _lastname = lastname ? lastname : "";
  let _patronymic = patronymic ? patronymic : "";

  const isCorrect = Boolean(_firstname && _lastname);

  if (isCorrect && min) {
    _firstname = _firstname.substring(0, 1) + ".";
    _patronymic = _patronymic && _patronymic.substring(0, 1) + ".";
  }

  return isCorrect ? `${_lastname} ${_firstname} ${_patronymic}` : "";
}
