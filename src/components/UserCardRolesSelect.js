import React from 'react';
import _ from 'lodash';
import CustomSelect from 'components/CustomSelect/CustomSelect';

export function UserCardRolesSelect(props) {
	const {
		variant,
		error,
		setFieldTouched = () => { },
		classes,
		className,
		menuItems = [],
		value = '',
		touched,
		fieldName,
		setFieldValue = () => { }
	} = props;

	function translateMenuItems(menuItemsToTranslate) {
		return menuItemsToTranslate.map((item) => {
			return {
				id: item.id,
				value: item.c_name,
				description: item.c_description
			}
		});
	}

	function translateValue(valueToTranslate) {
		if (valueToTranslate.length < 3) return [];

		const valueToTranslateInter = valueToTranslate.slice(1, -1);

		return valueToTranslateInter.split('.');
	}

	function handleChange(newValue) {
		let cClaimsToSet;

		if (newValue.length > 0) {
			cClaimsToSet = `.${newValue.join('.')}.`; 
		} else {
			cClaimsToSet = '';
		}
				
		setFieldValue(fieldName, cClaimsToSet);
	}

	return (
		<CustomSelect 
			error={error}
			touched={touched}
			variant={variant}
			formControlProps={{
				classes,
				className,
				required: true,
			}}
			selectProps={{
				multiple: true
			}}
			name={fieldName}
			label='Роль'
			withButtons={true}
			menuItems={translateMenuItems(menuItems)}
			value={translateValue(value)}
			setFieldTouched={setFieldTouched}
			onChange={handleChange}
		/>
	);
}
