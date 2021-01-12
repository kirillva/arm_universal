import React from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import styles from './FormikDateField.module.css';

import 'moment/locale/ru';

moment.locale('ru');

const FormikDateField = ({ label, name, setFieldValue, values, fieldProps = {} }) => {
	return (
		<div className={styles.fieldWrapper}>
			<MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="ru">
				<KeyboardDatePicker
					className={styles.datePicker}
					variant="inline"
					autoOk
					invalidDateMessage="Некорректный формат даты"
					inputVariant="outlined"
					format="DD.MM.YYYY"
					label={label}
					value={values[name]}
					onChange={value => setFieldValue(name, value)}
					{...fieldProps}
				/>
			</MuiPickersUtilsProvider>
		</div>
	);
};

export { FormikDateField as default };
