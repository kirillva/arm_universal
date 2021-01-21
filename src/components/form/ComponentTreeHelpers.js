import _ from "lodash";
import merge from "merge";
import { GetGUID } from "utils/helpers";

export const orderNodes = (a, b) => {
  if (a.order > b.order) return 1;
  else if (a.order < b.order) return -1;
  else return 0;
};
/**
 * Преобразование объекта элементов формы в плоский массив
 * @param {*} items элементы формы
 */
export const getComponentsArr = (items) => {
  const componentsArr = Object.keys(items).map((key) => {
    return { key: key, ...items[key] };
  });
  componentsArr.sort((a, b) => {
    if (a.parent.length > b.parent.length) return 1;
    if (a.parent.length < b.parent.length) return -1;
    return 0;
  });
  return componentsArr;
};

/**
 * Преобразовать плоский массив компонентов в дерево
 * @param {*} componentsArr массив компонетов
 */
export const getComponentsTree = (array) => {
  var componentsArr = _.cloneDeep(array);
  const components = [];
  componentsArr.forEach((component) => {
    var clonedComponent = _.cloneDeep(component);
    let arrWhereSearch = components;
    if (!component.parent.length) components.push(component);

    while (component.parent.length > 0) {
      const parentComponentId = component.parent.shift();
      // поиск компонента к которому нужно прикрепить очередной элемент
      const parentComponent = arrWhereSearch.find((item) => {
        return item.key === parentComponentId;
      });
      // Добавляем промежуточные компоненты а если это самый глубокий то его
      if (!parentComponent.child) parentComponent.child = [clonedComponent];
      else if (!component.parent.length)
        parentComponent.child.push(clonedComponent);

      arrWhereSearch = parentComponent.child;
    }
  });
  return components;
};

/**
 * Преобразовать узел в extjs
 * @param {*} node узел
 */
const getExtJSNode = (node) => {
  let newNode = {};
  if (node.horisontal === true) {
    newNode.layout = "hbox";
    newNode.xtype = "container";
  }
  if (node.horisontal === false) {
    newNode.layout = "vbox";
    newNode.xtype = "container";
  }
  if (node.child || node.items) {
    newNode.items = [];
  }
  if (node.child) {
    newNode.items = newNode.items.concat(node.child.map(getExtJSNode));
  }
  if (node.items) {
    newNode.items = newNode.items.concat(node.items.map(getExtJSNode));
  }

  // if (node) {
  //   newNode = node;
  // }
  newNode.xtype = newNode.xtype || node.xtype;
  return { ...newNode, ...node.props };
  // return { ...newNode, ...node };
};

/**
 * Преобразовать дерево компонентов в extjs
 * @param {*} tree дерево компонентов
 */
export const getExtJSView = (tree) => {
  return tree.map(getExtJSNode);
};

export const getExtJSFromReactView = (tree) => {
  const componentArr = getComponentsArr(tree);
  const componentTree = getComponentsTree(componentArr);
  const extjsView = getExtJSView(componentTree);
  return extjsView;
}

/**
 * Преобразовать extjs в дерево компонентов
 * @param {*} tree дерево компонентов
 */
export const getReactFromExtJSView = (extjs) => {
  const _items = {};

  let _order = 1;

  let stack = extjs;

  while (stack.length !== 0) {
    const item = stack.pop();

    const id = GetGUID();

    let childLayouts = item.items
      ? item.items.filter((item) => item.layout)
      : [];

    const components = item.items
      ? item.items.filter((item) => !item.layout)
      : [];

    const _item = {
      horisontal: item.layout === "vbox" ? false : true,
      order: _order,
      items: components,
      parent: item.parent || []
    };

    if (childLayouts.length) {
      childLayouts.forEach((item) => {
        if (item.parent) {
          item.parent.push(id);
        } else {
          item.parent = [id];
        }
      });

      stack = stack.concat(childLayouts);
    }

    _items[id] = _item;

    _order++;
  }


  return _items
};


let order = 0;
export const updateFormObject = ({
  items,
  id,
  parentId,
  options,
  sort,
  moveUp = false,
  moveDown = false,
  formContent,
}) => {
  const orderObject = {};
  if (moveUp || moveDown) {
    const currentOrder = formContent[id].order;
    const searchingOrder = currentOrder + moveDown - moveUp;
    if (searchingOrder <= order && searchingOrder > 0) {
      let found = null;
      Object.keys(formContent).forEach((key) => {
        if (formContent[key].order === searchingOrder) {
          found = { key: key, ...formContent[key] };
          return;
        }
      });

      orderObject[id] = {};
      orderObject[id].order = searchingOrder;
      orderObject[found.key] = {};
      orderObject[found.key].order = currentOrder;
    }
  } else {
    orderObject[id] = {};
    orderObject[id].order = formContent[id] ? formContent[id].order : ++order;
  }
  const newObject = merge.recursive(
    formContent,
    {
      [id]: {
        items: items,
        parent: parentId || formContent[id].parent,
        horisontal: options
          ? options.horisontal
          : formContent[id]
          ? formContent[id].horisontal
          : false,
      },
    },
    { ...orderObject }
  );
  return { ...newObject };
};
