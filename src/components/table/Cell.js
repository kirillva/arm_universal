import React from 'react';

export const DateCell = ({ cell, ...props }) => {
	const value = cell.value;
	return <div>{value ? new Date(value).toLocaleDateString() : ''}</div>;
};

export const NumberCell = ({ cell, ...props }) => {
	const value = cell.value;
	return <div>{value ? value : ''}</div>;
};

export const StringCell = ({ cell, ...props }) => {
	const value = cell.value;
	return <div>{value ? value : ''}</div>;
};

export const SelectCell = ({ cell, ...props }) => {
	const value = cell.row.original[cell.column.mapAccessor];
	return <div>{value ? value : ''}</div>;
};

export const BoolCell = ({ cell, ...props }) => {
	const value = cell.value;
	return <div>{value ? 'Да' : value === false ? 'Нет' : ''}</div>;
};
