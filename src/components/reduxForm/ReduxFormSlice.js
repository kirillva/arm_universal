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
  },
});

export default ReduxFormSlice.reducer;
