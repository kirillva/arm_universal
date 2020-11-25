import data from "../config/config.json";
import localForage from "localforage";
import { runRpc } from "./rpc.js";
localForage.config({
  name: "log"
});
const regionconfig = {};
// require(`../config/${"config" &&
//   process.env.REACT_APP_REFERENCE}`);

export const WARNING_LOG = "warning";
export const ACTION_LOG = "action";

/**
 * Проверяет есть ли ключ списке
 * @param {Array} list список ключей доступа
 * @param {String} constant ключ доступа
 */
export function findAccess(list, constant) {
  return list.indexOf(constant) !== -1;
}

/**
 * Возвращает уникальный идентификатор
 */
export const GetGUID = function(short = false) {
  var d = new Date().getTime();
  var uuid = ""
  if (short) {
    uuid = "xxxxxxxx"
  } else {
    uuid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
  uuid = uuid.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r && 0x7 | 0x8).toString(16);
  });
  return uuid;
};

export const getConfig = function() {
  let config = localStorage.getItem("config");
  try {
    config = JSON.parse(config);
  } catch (error) {
    writeLog({ date: new Date(), type: WARNING_LOG, data: error });
    config = {};
  }
  return Object.assign(data, config, regionconfig);
};

export const setConfig = function(config) {
  try {
    config = JSON.stringify(config);
  } catch (error) {
    writeLog({ date: new Date(), type: WARNING_LOG, data: error });
    config = "{}";
  }
  localStorage.setItem("config", config);
};

export const writeLog = function(data) {
  localForage.setItem(GetGUID(), data);
};

export const getDivisions = async () => {
  const responce = await Promise.all([
    runRpc({
      action: "sd_divisions",
      method: "Query",
      data: [{}],
      type: "rpc"
    }),
    runRpc({
      action: "sd_subdivisions",
      method: "Query",
      data: [{}],
      type: "rpc"
    })
  ]);
  const sd_divisions = responce[0].result.records;
  const sd_subdivisions = responce[1].result.records;

  const sd_division_keys = {};
  sd_divisions.forEach(item => (sd_division_keys[item.id] = item));
  const sd_subdivision_keys = {};
  sd_subdivisions.forEach(item => (sd_subdivision_keys[item.id] = item));

  const divisions = sd_divisions.map(item => {
    let val = {
      id: item.id,
      level: 0,
      divisions: [item.id],
      c_name: item.c_name
    };
    let parent = item;
    let counter = 10;
    while (parent.f_division && counter) {
      counter--;
      parent = sd_division_keys[parent.f_division];
      val.divisions.push(parent.id);
      val.level += 1;
    }
    if (val.divisions.length > 1) {
      val.maindivision = val.divisions[val.divisions.length - 1];
      val.division = val.divisions[0];
    } else {
      val.maindivision = val.divisions[0];
    }
    return val;
  });

  const subdivisions = [];
  sd_subdivisions.forEach(item => {
    let val = {};

    const parent = divisions.find(division => division.id === item.f_division);
    subdivisions.push({
      ...parent,
      subdivision: item.id,
      c_name: item.c_name,
      level: parent.level + 1
    });

    return val;
  });

  return divisions.concat(subdivisions);
};

export const arrayMove = (array, moveIndex, toIndex) => {
  const item = array[moveIndex];
  const length = array.length;
  const diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length)
    ];
  } else if (diff < 0) {
    // move right
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length)
    ];
  }
  return array;
};

export const ArrayToObjByUID = (array, name) => {
  const obj = {};
  if (array && array.length) {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      obj[item[name]] = item;
    }
  }
  return obj;
};
