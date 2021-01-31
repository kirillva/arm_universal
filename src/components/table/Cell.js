export const DateCell = ({ cell, ...props }) => {
	const value = cell.value;
	return value ? new Date(value).toLocaleDateString() : '';
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
	debugger;
	const value = cell.row.original[cell.column.mapAccessor];
	return value ? value : '';
};

export const BoolCell = ({ cell, ...props }) => {
	const value = cell.value;
	return value ? 'Да' : value === false ? 'Нет' : '';
};
