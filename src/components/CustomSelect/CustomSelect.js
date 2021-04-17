import React, { useState, useEffect } from 'react';
import pt, { func } from 'prop-types';
import classnames from 'classnames';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import styles from './CustomSelect.module.css';
import { Button } from '@material-ui/core';

function CustomSelect(props) {
	const {
    name,
    value,
    label = '',
    error,
    touched,
    menuItems,
    formControlProps = {},
    selectProps = {},
    onChange,
    setFieldTouched,
    onMultipleChange = () => {},
    withButtons = false,
    variant = 'standard'
  } = props;
  
  const LABEL_ID = 'custom-select' + name;

  const [innerValue, setInnerValue] = useState(selectProps.multiple ? [] : '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  function handleChange(event) {
    const _value = event.target.value;
    const currentSelected = _value[_value.length - 1];

    
    if (
      selectProps.multiple
    ) {
      if (!currentSelected && _value.length > 0) {
        return;
      }
      setInnerValue(_value);
      onMultipleChange(_value);
    } else {
      onChange(_value);
    }
  }
  
  function handleClose() {
    setOpen && setOpen(false);
    
    if (selectProps.multiple) {
      onChange(innerValue);
    }
    
    setFieldTouched(name);
  }
  
  const handleCancel = () => {
    setOpen(false); 
    setInnerValue(value);
  }
  
  const handleOk = () => {
    setOpen(false); 
    handleClose(); 
  }

	return (
    <TextField 
      variant={variant}
      {
        ...formControlProps
      }
      InputProps={{
        onClickCapture: ()=>{
          if (!selectProps.onClick && !selectProps.disabled) {
            setOpen && setOpen(true);
          }
        }
      }}
      SelectProps={{
        ...selectProps,
        open: open,
        onClose: withButtons ? handleCancel : handleClose,
        classes: {
          ...(selectProps.classes || {}),
          root: styles.SelectRoot
        } 
      }}
      label={label}
      select
      error={!!touched && !!error}
      helperText={error}
      id={LABEL_ID}
      name={name}
      value={innerValue}
      onChange={handleChange}
		>
      {
        menuItems.map((item) => {
          return (
            <MenuItem
              key={item.id}
              value={item.value}
              className={classnames({
                [styles.MenuItemLevel1]: item.level === 1,
                [styles.MenuItemLevel2]: item.level === 2
              })}
              classes={{
                selected: styles.MenuItemSelected
              }}
            >
              {item.description}
            </MenuItem>
          );
        })
      }
      {withButtons && <div className={styles.buttons}>
        <Button color='secondary' variant='contained' onClick={handleOk}>Oк</Button>
				<Button color='primary' variant='contained' onClick={handleCancel}>Отмена</Button>
			</div>}
		</TextField>
	);
}

CustomSelect.defaultProps = {

}

CustomSelect.propTypes = {
  name: pt.string.isRequired,
  value: pt.oneOfType([
    pt.any,
    pt.arrayOf(
      pt.any
    )
  ]),
  label: pt.string,
  error: pt.string,
  touched: pt.bool,
  menuItems: pt.arrayOf(
    pt.shape({
      id: pt.any.isRequired,
      value: pt.any,
      description: pt.string.isRequired
    })
  ).isRequired,
  formControlProps: pt.object,
  selectProps: pt.object,
  onChange: pt.func.isRequired,
  setFieldTouched: pt.func.isRequired,
  onMultipleChange: pt.func
}

export default CustomSelect;