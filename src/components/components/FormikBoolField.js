import React from 'react';
import { FormikSelectField } from '..';

const FormikBoolField = ({ ...props }) => {
	return (
		<FormikSelectField
			data={[
				{ value: true, title: 'Да' },
				{ value: false, title: 'Нет' }
			]}
			{...props}
		/>
	);
};

export { FormikBoolField as default };
