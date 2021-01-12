import React from 'react';
import { TextField as MaterialTextField } from '@material-ui/core';

const FormikTextField = ({ label, name, setFieldValue, values, fieldProps = {}, error, touched, ...props }) => {	
	return (
		<MaterialTextField
			name={name}
			label={label}
			value={values[name] ? values[name] : ''}
			variant="outlined"
			margin="dense"
			onChange={e => setFieldValue(name, e.target.value)}
			error={error && touched}
			helperText={error && touched ? error : ''}
			{...fieldProps}
			{...props}
		/>
	);
};

export { FormikTextField as default };
