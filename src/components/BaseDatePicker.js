import React, { useState } from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { TextField, IconButton, Button } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import styles from './BaseDatePicker.module.css';
import DateRangeOutlined from '@material-ui/icons/DateRangeOutlined';
import 'moment/locale/ru';

const BaseDatePicker = ({
	value = {},
	className,
	onChange,
	DialogProps = {},
	error = false,
	errorText = '',
	label = '',
	InputProps,
	initialDateStart = null,
	initialDateFinish = null
}) => {
	const [startDate, setStartDate] = useState(initialDateStart);
	const [endDate, setEndDate] = useState(initialDateFinish);

	const dataInputOptions = {
		variant: 'inline',
		invalidDateMessage: 'Некорректный формат даты',
		inputVariant: 'outlined',
		className: styles.dataWrapper,
		format: 'DD.MM.YYYY'
	};

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const getDate = date => {
		if (date && date.isValid()) {
			return date;
		}
	};

	const handleClose = () => {
		onChange({ start: getDate(startDate), finish: getDate(endDate) });
		setAnchorEl(null);
	};

	const handleCancel = () => {
		setAnchorEl(null);
		onChange({ start: null, finish: null });
		setStartDate(null);
		setEndDate(null);
	}

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const renderPeriod = () => {
		const _startDate = getDate(startDate);
		const _endDate = getDate(endDate);
		if (!_startDate && !_endDate) {
			return '';
		}
		if (_startDate && !_endDate) {
			return _startDate.format('DD.MM.YYYY');
		}
		if (!_startDate && _endDate) {
			return _endDate.format('DD.MM.YYYY');
		}
		if (_startDate && _endDate) {
			return `${_startDate.format('DD.MM.YYYY')} - ${_endDate.format('DD.MM.YYYY')}`;
		}
		if (_startDate.isSame(_endDate)) {
			return _startDate.format('DD.MM.YYYY');
		}
		return '';
	};

	return (
		<MuiPickersUtilsProvider aria-describedby={id} libInstance={moment} utils={MomentUtils} locale={'ru'}>
			<TextField
				margin="none"
				size="small"
				variant="outlined"
				value={renderPeriod()}
				className={className}
				placeholder="Поиск..."
				InputProps={{
					contentEditable: false,
					endAdornment: (
						<IconButton 
							onClick={handleClick}
							size='small'
						>
							<DateRangeOutlined />
						</IconButton>
					),
					...InputProps
				}}
			/>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<div className={styles.fieldsWrapper}>
					<KeyboardDatePicker
						label={'С'}
						value={startDate}
						{...dataInputOptions}
						onChange={value => {
							setStartDate(value ? value.utc().hours(0).minutes(0).seconds(0) : value);
						}}
						{...InputProps}
						margin='dense'
						autoOk
					/>
					<KeyboardDatePicker
						label={'По'}
						value={endDate}
						{...dataInputOptions}
						onChange={value => {
							setEndDate(value ? value.utc().hours(23).minutes(59).seconds(59) : value);
						}}
						{...InputProps}
						margin='dense'
						autoOk
					/>
				</div>
				<div className={styles.button}>
					<Button onClick={handleClose} variant={'contained'} color="primary">Применить</Button>
					<Button onClick={handleCancel} variant={'contained'} color="secondary">Очистить</Button>
				</div>
			</Popover>
		</MuiPickersUtilsProvider>
	);
};

export default BaseDatePicker;
