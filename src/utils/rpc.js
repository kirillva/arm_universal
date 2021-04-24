import { getConfig } from "./helpers";
import { logout, getToken } from "./user";

/**
 * Получение изображений по id и type
 * @param {*} param0
 */
export const getPhoto = ({ object_id, type }) => {
  const options = {
    method: "GET",
    headers: {
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
    },
  };

  return new Promise((resolve, reject) => {
    const config = getConfig();
    const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
    fetch(`${BASE_URL}/file/${type}/images?object_id=${object_id}`, {
      mode: "cors",
      ...options,
    })
      .then((response) => {
        response
          .json()
          .then((json) => {
            resolve(json);
          })
          .catch(() => {
            reject({
              status: 200,
              msg: "Изображения не найдены",
            });
          });
      })
      .catch(() => {
        reject({
          status: 500,
          msg: "Ошибка! Повторите попытку",
        });
      });
  });
};

/**
 * Получить список фотографий по акту
 * @param {*} id
 */
export const getPhotosByResultId = (id) => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  return new Promise((resolve, reject) => {
    runRpc({
      action: "cd_attachments",
      method: "Query",
      data: [
        {
          filter: [
            {
              property: "fn_result",
              value: id,
              operator: "=",
            },
          ],
        },
      ],
      type: "rpc",
    })
      .then((responce) => {
        if (responce.meta.success) {
          resolve({
            success: true,
            files: responce.result.records.map((item) => {
              return `${BASE_URL}/file?id=${item.fn_file}`;
            }),
          });
        }
      })
      .catch((error) => {
        resolve({ success: false, files: [] });
      });
  });
};

/**
 * Удаление пользователя
 */
export const removeUserAccount = () => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  return Execute("removeUserAccount", {
    method: "POST",
    headers: {
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `REMOVE_ACCOUNT_EMAIL_URL=${BASE_URL}&RETURN_URL=${
      window.location.origin + window.location.pathname
    }#/login`,
  });
};

/**
 * Сброс пароля
 * @param {string} email электронная почта
 */
export const resetPassword = (email) => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  return Execute("resetPassword", {
    method: "POST",
    body: `Email=${email}&RESET_PASSWORD_EMAIL_URL=${BASE_URL}&RETURN_URL=${
      window.location.origin + window.location.pathname
    }#/login`,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};

/**
 * Регистрация пользователя
 * @param {string} userName имя пользователя
 * @param {string} password пароль
 * @param {string} email электронная почта
 * @param {string} tel телефон
 */
export const register = (userName, password, email, tel) => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  return Execute("register", {
    method: "POST",
    body: `UserName=${userName}&Password=${password}&Email=${email}&Tel=${tel}&REGISTER_CONFIRMED_EMAIL_URL=${BASE_URL}&RETURN_URL=${
      window.location.origin + window.location.pathname
    }#/login`,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};

/**
 * Формирование ссылки на PDF
 */
export const getPdfUrl = () => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  const returnUrl = `${
    window.location.origin + window.location.pathname
  }#/login`;
  return `${BASE_URL}/generatePdf?rpc-authorization=${getToken()}&url=${encodeURIComponent(
    window.location.href + "?access_token=" + getToken()
  )}&returnUrl=${encodeURIComponent(returnUrl)}`;
};

export const sendEmail = (email) => {
  const url = `sendemail?to=${email}&authorization=${getToken()}`;
  return Execute(url, {
    method: "GET",
  });
};

/**
 * Смена пароля
 * @param {string} password предыдущий пароль
 * @param {string} newPassword новый пароль
 */
export const changePassword = (password, newPassword) => {
  return Execute("changePassword", {
    method: "POST",
    body: `password=${password}&newPassword=${newPassword}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
    },
  });
};

/**
 * Авторизация
 * @param {string} userName имя пользователя
 * @param {string} password пароль
 */
export const auth = (userName, password) => {
  return Execute("auth", {
    method: "POST",
    body: `UserName=${userName}&Password=${password}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};
/**
 * Выполнить rpc-запрос
 * @param {*} body
 */
export const runRpc = (body, token) => {
  if (body.namespace) body.action = `${body.namespace}.${body.action}`;
  return Execute("rpc", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "RPC-Authorization":
        (token ? `Token ${token}` : "") ||
        (getToken() ? "Token " + getToken() : ""),
      "Content-Type": "application/json",
    },
  });
};

export const runRpcRecords = async body => {
	const response = await runRpc(body);
	return response.result.records;
}

export const runRpcSingleRecord = async body => {
	const response = await runRpc({...body, limit: 1});
	const records = response.result.records;
	if (records && records.length) {
		return records[0];
	} else {
		return null;
	}
}

/**
 * Выполнить rpc-запрос
 * @param {*} body
 */
export const GetTableRecords = async ({ action, data }) => {
  let responce;
  try {
    responce = await Execute("rpc", {
      method: "POST",
      body: JSON.stringify({
        action,
        method: "Query",
        data: data ? data : [{}],
        type: "rpc",
      }),
      headers: {
        "RPC-Authorization": getToken() ? "Token " + getToken() : "",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return [];
  }
  return responce.result.records;
};

export const sendFormData = (url, formData) => {
  return Execute(url, {
    method: "POST",
    body: formData,
    headers: {
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
    },
  });
};

/**
 * Получение навигации
 */
export const getNavigation = (url = "menu/navigation") => {
  return Execute(url, {
    method: "GET",
    headers: {
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
    },
  });
};

export const getUserInfo = (userName, url = "user") => {
  return Execute(url, {
    method: "GET",
    body: `UserName=${userName}`,
    headers: {
      "RPC-Authorization": getToken() ? "Token " + getToken() : "",
    },
  });
};

/**
 * Обобщенный метод для отправки запросов
 * @param {*} url
 * @param {*} options
 */
const Execute = (url, options) => {
  const config = getConfig();
  const BASE_URL = config.BASE_URL.replace("{0}", config.dir);
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/${url}`, {
      mode: "cors",
      ...options,
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((json) => {
            if (json.length >= 1) json = json[0];
            if (json.meta) {
              localStorage.setItem('activate', '');
              if (json.meta.activate === true) {
                localStorage.setItem('activate', 1);
              }
              if (json.meta.activate === false) {
                localStorage.setItem('activate', 0);
              }
              if (json.meta.success) resolve(json);
              else {
                if (json.code === 401) logout();
                reject({
                  status: json.code,
                  msg: json.meta.msg,
                });
              }
            } else resolve(json);
          });
        } else {
          reject({
            status: response.status,
            msg: response.statusText,
          });
        }
      })
      .catch(() => {
        reject({
          status: 500,
          msg: "Ошибка! Повторите попытку",
        });
      });
  });
};
