import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { getElementByBreadcrumbs } from "./ReduxFormHelpers";

const form = {
  xtype: "components",
  layout: "vbox",
  items: [
    {
      layout: "hbox",
      items: [
        {
          xtype: "textfield",
          fieldLabel: "First Name",
          name: "firstName",
        },
        {
          xtype: "textfield",
          fieldLabel: "Last Name",
          name: "lastName",
        },
      ],
    },
    {
      layout: "hbox",
      items: [
        {
          xtype: "numberfield",
          fieldLabel: "Date of Birth",
          name: "birthDate",
        },
        {
          xtype: "textfield",
          fieldLabel: "Last Name",
          name: "lastName1",
        },
      ],
    },
    {
      xtype: "textfield",
      fieldLabel: "Last Name",
      name: "lastName2",
    },
    {
      xtype: "combobox",
      fieldLabel: "Last Name",
      name: "lastName3",
    },
  ],
};

const ReduxFormSlice = createSlice({
  name: "reduxForm",
  initialState: {
    form: form,
    edit: false,
    breadcrumbs: [],
  },
  reducers: {
    setEdit: (state, payload) => {
      state.edit = payload.edit;
    },
    setBreadcrumbs: (state, payload) => {
      state.breadcrumbs = payload.breadcrumbs;
    },
    updateByBreadcrumbs: (state, payload) => {
      let item = getElementByBreadcrumbs(state.form, state.breadcrumbs)
      item = _.merge(item, payload.selectedItem);
    },
    addElement: (state, payload) => {
      let item = getElementByBreadcrumbs(state.form, payload.breadcrumbs);
      if (!item.items) {
        item.items = [];
      }
      item.items.push(payload.item)
    },
    moveElement: (state, payload) => {
      let originItem = getElementByBreadcrumbs(state.form, state.breadcrumbs);
      const position = payload.breadcrumbs.pop();
      let targetItem = getElementByBreadcrumbs(state.form, payload.breadcrumbs);
      
      targetItem.items.splice(position, 0, originItem);

      const containerBreadcrumbs = _.clone(state.breadcrumbs)
      containerBreadcrumbs.pop();

      let originContainer = getElementByBreadcrumbs(state.form, containerBreadcrumbs);
      let _position = state.breadcrumbs;
      originContainer.items.splice(_position, 1);
    }
  },
});

export default ReduxFormSlice.reducer;
