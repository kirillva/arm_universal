import React from "react";
import BaseLayout from "./BaseLayout";
import {
  getComponentsArr,
  getComponentsTree,
  orderNodes
} from "./ComponentTreeHelpers";


const renderTree = (rootNode, updateLayout) => {
  const components = [];
  if (rootNode.child) {
    rootNode.child = rootNode.child.sort(orderNodes);
    rootNode.child.forEach(element => {
      components.push(renderTree(element, updateLayout));
    });
  }
  
  return (
    <BaseLayout
      key={rootNode.key}
      parentId={rootNode.parent}
      droppableId={rootNode.key}
      items={rootNode.items}
      horisontal={rootNode.horisontal}
      updateLayout={updateLayout}
    >
      {components.map(item => {
        return item;
      })}
    </BaseLayout>
  );
};

/**
 * Отрисовать дерево компонентов
 * @param {*} componentsTree
 */
export const renderComponentsTree = ({
  componentsTree,
  updateLayout,
  renderTree
}) => {
  const components = [];
  componentsTree = componentsTree.sort(orderNodes);
  componentsTree.forEach(node => {
    components.push(renderTree(node, updateLayout));
  });
  return components;
};

const FormWrapper = ({ items, updateLayout }) => {
  const componentsArr = getComponentsArr(items);
  const componentsTree = getComponentsTree(componentsArr);

  const form = renderComponentsTree({
    componentsTree: componentsTree,
    updateLayout: updateLayout,
    renderTree: renderTree
  });
  return form;
};

export default FormWrapper;
