import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

export const TextFieldOptions = ({ item, afterChange = () => { } }) => {
    const classes = useStyles();

    const onChange = (name) => {
        return (e) => {
            item[name] = e.target.value;
            afterChange();
        }
    }

    if (!item) return null;

    return <div className={classes.optionsContainer}>
        <TextField
            name={'fieldLabel'}
            onChange={onChange('fieldLabel')}
            label={'Наименование'}
            value={item.fieldLabel}
            variant="outlined"
        />
        <TextField
            name={'margin'}
            onChange={onChange('margin')}
            label={'Отступ'}
            value={item.margin || ''}
            variant="outlined"
        />
    </div>
}