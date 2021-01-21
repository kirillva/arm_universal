import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import classNames from 'classnames';

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
    console.log('breadcrumbs', breadcrumbs);
  };

  const onSelectContainer = () => {
    console.log('breadcrumbs', breadcrumbs);
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
    <div
      className={classNames(classes.wrapper, {
        [classes.vertical]: layout === "vbox",
        [classes.horisontal]: layout === "hbox",
      })}
      onClick={onSelectContainer}
    >
      {children}
    </div>
  );
};

export const getElementByBreadcrumbs = (form, breadcrumbs) => {
    let item = form;
    debugger;
    breadcrumbs.forEach((index) => {
      item = item.items[index];
    });

    return item;
}

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
