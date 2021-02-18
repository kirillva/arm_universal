import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    outline: "2px dashed black",
    margin: "3px",
    flex: 1,
  },
  tools: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    margin: theme.spacing(1),
  },
  vertical: {
    display: "flex",
    flexDirection: "column",
  },
  horisontal: {
    display: "flex",
    flexDirection: "row",
  },
}));

const BreadcrumbsComponent = ({
  children,
  breadcrumbs,
  layout,
  xtype,
  name,
  margin,
  padding,
  formEdit,
  fieldLabel,
}) => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const onSelectField = () => {
    dispatch({
      type: "reduxForm/setBreadcrumbs",
      breadcrumbs,
    });
  };

  const onSelectContainer = () => {
    dispatch({
      type: "reduxForm/setBreadcrumbs",
      breadcrumbs,
    });
  };

  const addContainer = () => {
    // TODO: лобавление элемента
    dispatch({
      type: "reduxForm/addElement",
      breadcrumbs,
      item: {
        xtype: 'textfield'
      }
    });
  }

  switch (xtype) {
    case "textfield":
      return (
        <TextField
          disabled={formEdit}
          onClick={onSelectField}
          name={name}
          style={{ margin: margin, padding: padding }}
          label={fieldLabel}
          variant="outlined"
        />
      );
    case "numberfield":
      return (
        <TextField
          disabled={formEdit}
          onClick={onSelectField}
          name={name}
          style={{ margin: margin, padding: padding }}
          label={fieldLabel}
          variant="outlined"
        />
      );

    case "combobox":
      return (
        <TextField
          disabled={formEdit}
          onClick={onSelectField}
          name={name}
          style={{ margin: margin, padding: padding }}
          label={fieldLabel}
          variant="outlined"
        />
      );

    default:
      break;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.tools}>
        <Button color="primary" variant="contained" onClick={onSelectContainer}>
          Выбрать
        </Button>
        <Button color="primary" variant="contained" onClick={addContainer}>
          <Add />
        </Button>
      </div>
      <div
        className={classNames(classes.wrapper, {
          [classes.vertical]: layout === "vbox",
          [classes.horisontal]: layout === "hbox",
        })}
      >
        {children}
      </div>
    </div>
  );
};

export const getElementByBreadcrumbs = (form, breadcrumbs) => {
  let item = form;
  breadcrumbs.forEach((index) => {
    item = item.items[index];
  });

  return item;
};

export const renderForm = (form) => {
  const renderComponent = (_form, breadcrumbs) => {
    const { items, ...props } = _form;
    return (
      <BreadcrumbsComponent {...props} breadcrumbs={breadcrumbs}>
        {items.map((item, id) => {
          if (item.layout) {
            return renderComponent(item, [...breadcrumbs, id]);
          } else {
            return (
              <BreadcrumbsComponent
                {...item}
                breadcrumbs={[...breadcrumbs, id]}
              ></BreadcrumbsComponent>
            );
          }
        })}
      </BreadcrumbsComponent>
    );
  };

  return renderComponent(form, []);
};
