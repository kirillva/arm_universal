import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

export const TextFieldOptions = ({ selectedItem, setSelectedItem }) => {


    const classes = useStyles();

    const onChange = (name) => {
        return (e) => {
            selectedItem[name] = e.target.value;
        }
    }

    // const onSelectedItem = () => {
    //     setSelectedItem(selectedItem);
    // }

    // const onCancelItem = () => {
    //     setSelectedItem(null);
    // }

    if (!selectedItem) return null;

    return <div className={classes.optionsContainer}>
        <TextField
            name={'fieldLabel'}
            onChange={onChange('fieldLabel')}
            label={'fieldLabel'}
            value={selectedItem.fieldLabel || ''}
            variant="outlined"
        />
        <TextField
            name={'margin'}
            onChange={onChange('margin')}
            label={'margin'}
            value={selectedItem.margin || ''}
            variant="outlined"
        />

        <Button
            color="primary"
            variant="contained"
            // onClick={onSelectedItem}
        >
            Сохранить
            </Button>
        <Button
            color="secondary"
            variant="contained"
            // onClick={onCancelItem}
        >
            Отменить
            </Button>
    </div>
}