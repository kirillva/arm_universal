
import React, { useEffect, useState } from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, DialogActions, DialogContent, TextField } from "@material-ui/core";
import _ from "lodash";

export const AddNewField = ({ setKeys, keys, open, onClose }) => {

    const [addField, setAddField] = useState(null);

    useEffect(()=>{
        setAddField(null)
    }, [open]);

    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>Добавление нового свойства</DialogTitle>
        <DialogContent>
            <TextField
                onChange={(e) => setAddField(e.target.value)}
                label={'Текст свойства'}
                value={addField || ""}
                variant="outlined"
            />
        </DialogContent>
        <DialogActions>
            <Button
                color="primary"
                variant="contained"
                disabled={!Boolean(addField)}
                onClick={(e) => {
                    setKeys(_.uniqBy([...keys, addField]));
                    onClose();
                }}
            >
                Добавить поле
            </Button>
        </DialogActions>
    </Dialog>
}