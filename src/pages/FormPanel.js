import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { TextFieldOptions } from "../components/forms/TextFieldOptions";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  hbox: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  vbox: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 255, 0, 0.2)",
  },
  border: {
    display: "flex",
    flexDirection: "column",
    outline: "2px dashed black",
    margin: "3px",
  },
  textFieldRoot: {
    flex: 1,
  },
  formContent: {
    display: "flex",
    flexDirection: "row",
  },
  form: {
    flex: 2,
  },
  tools: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    margin: theme.spacing(1),
  }
}));

export const FormPanel = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const classes = useStyles();

  const [form, setForm] = useState([
    {
      xtype: "form",
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
              xtype: "datefield",
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
          xtype: "textfield",
          fieldLabel: "Last Name",
          name: "lastName3",
        },
      ],
    }
  ]);

  const Container = ({ item, visible = false }) => {
    const _items = [];
    const { items, layout } = item;

    if (!items) return null;

    items.forEach((item) => {
      switch (item.xtype) {
        case "datefield":
          _items.push(
            <TextField
              onClick={() => {
                setSelectedItem(item);
              }}
              name={item.name}
              classes={{ root: classes.textFieldRoot }}
              style={{ margin: item.margin }}
              label={item.fieldLabel}
              variant="outlined"
            />
          );
          break;

        case "textfield":
          _items.push(
            <TextField
              onClick={() => {
                setSelectedItem(item);
              }}
              name={item.name}
              classes={{ root: classes.textFieldRoot }}
              style={{ margin: item.margin }}
              label={item.fieldLabel}
              variant="outlined"
            />
          );
          break;

        default:
          _items.push(<Container item={item} visible={visible} />);
          break;
      }
    });

    return <div className={visible ? classes.border : ""}>
      {visible && (
        <div className={classes.buttons}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              item.layout = layout === "vbox" ? "hbox" : "vbox";
              setForm([...form]);
            }}
          >
            {layout === "hbox" ? "hbox" : "vbox"}
          </Button>
          <Button
            color="primary"
            variant="contained"
          >
            +
          </Button>
        </div>
      )}
      <div className={layout === "hbox" ? classes.hbox : classes.vbox}>
        {_items}
      </div>
    </div>
  };

  const ExtJSToReact = ({ form, className, visible }) => {
    if (!form) return null;

    if (!form.length) {
      form = [form];
    }

    const components = [];
    form.forEach((item) => {
      components.push(<Container item={item} visible={visible} />);
    });

    return <div className={className}>{components}</div>;
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.formContent}>
        <div className={classes.form}>
          {useMemo(
            () => (
              <ExtJSToReact form={form} visible={true} />
            ),
            [form]
          )}
        </div>
        {selectedItem && (
          <div className={classes.tools}>
            <TextFieldOptions selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
            <pre>{JSON.stringify(form, null, 4)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
