import { createSlice } from "@reduxjs/toolkit";
import {
  getReactFromExtJSView,
  updateFormObject,
} from "components/form/ComponentTreeHelpers";
import _ from "lodash";

const form = [
  {
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
  },
];

const FormSlice = createSlice({
  name: "form",
  initialState: {
    form: getReactFromExtJSView(form),
    containerId: null,
    componentId: null,
    edit: false,
  },
  reducers: {
    setEdit: (state, payload) => {
      state.edit = payload.edit;
    },
    setFormState: (state, payload) => {
      state.form = updateFormObject({
        ...payload.props,
        formContent: state.form,
      });
    },
    setSelectedComponent: (state, payload) => {
      const { containerId, componentId } = payload;
      state.containerId = containerId;
      state.componentId = componentId;
    },
    updateSelectedComponent: (state, payload) => {
      const { props } = payload;
      if (state.containerId && state.componentId !== null) {
        state.form[state.containerId].items[state.componentId] = {
          ...state.form[state.containerId].items[state.componentId],
          ...props,
        };
      }
    },
    removeContainer: (state, payload) => {
      const { id } = payload;
      debugger;
      
      if (id) {
        const containers = [id];
        
        while (containers.length) {
          const lastId = containers.pop();
          // const item = state.form[lastId];

          Object.keys(state.form).forEach(key=>{
            if (state.form[key].parent.find(item=>item === lastId)) {
              containers.push(key);
            }
          });
          
          // if (item && item.parent) {
          //   containers = containers.concat(item.parent)
          // }
          delete state.form[lastId];
        }
      }
    },
    changeComponentOrder: (state, payload) => {
      const { toStart } = payload;
      if (state.containerId && state.componentId !== null) {
        if (toStart && state.componentId >= 1) {
          const temp =
            state.form[state.containerId].items[state.componentId - 1];
          state.form[state.containerId].items[state.componentId - 1] =
            state.form[state.containerId].items[state.componentId];
          state.form[state.containerId].items[state.componentId] = temp;

          state.componentId = state.componentId - 1;
        }
        if (
          !toStart &&
          state.componentId < state.form[state.containerId].items.length - 1
        ) {
          const temp =
            state.form[state.containerId].items[state.componentId + 1];
          state.form[state.containerId].items[state.componentId + 1] =
            state.form[state.containerId].items[state.componentId];
          state.form[state.containerId].items[state.componentId] = temp;

          state.componentId = state.componentId + 1;
        }
      }
    },
    removeComponent: (state) => {
      if (state.containerId && state.componentId !== null) {
        const [arr1, arr2] = _.chunk(
          state.form[state.containerId].items,
          state.componentId + 1
        );
        arr1.pop();
        state.form[state.containerId].items = arr1.concat(arr2 || []);

        if (state.componentId === 0) {
          state.componentId = null;
        }
        if (state.componentId > 0) {
          state.componentId = state.componentId - 1;
        }
      }
    },
  },
});

export default FormSlice.reducer;
