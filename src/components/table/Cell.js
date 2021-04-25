import moment from "moment";

export const DateCell = ({ cell, ...props }) => {
	const value = cell.value;
	const text = value ? new Date(value).toLocaleDateString() : '';
	return <div title={text}>{text}</div>;
};

export const NumberCell = ({ cell, ...props }) => {
	const value = cell.value;
	return value ? value : '';
};

export const StringCell = ({ cell, ...props }) => {
	const value = cell.value;
	return value ? value : '';
};

export const SelectCell = ({ cell, ...props }) => {
	const value = cell.row.original[cell.column.mapAccessor];
	return value ? value : '';
};

export const BoolCell = ({ cell, ...props }) => {
	const value = cell.value;
	return value ? 'Да' : value === false ? 'Нет' : '';
};

export const dateRenderer = (value) => {
	return moment(value).format('DD.MM.YYYY')
}