import React from 'react';
import styles from './styles.module.scss';

interface IFilterProps {
	filter: {
		product: string;
		price: string;
		brand: string;
	};
	onFilterChange: (event: any) => void;
	onFetchProducts: (event: any) => void;
}

const Filter: React.FC<IFilterProps> = ({ filter, onFilterChange, onFetchProducts }) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<input
				type='text'
				placeholder='Product name'
				name='product'
				value={filter.product}
				onChange={onFilterChange}
			/>
			<input type='number' placeholder='Price' name='price' value={filter.price} onChange={onFilterChange} />
			<input type='text' placeholder='Brand' name='brand' value={filter.brand} onChange={onFilterChange} />
			<button onClick={onFetchProducts}>Apply Filters</button>
		</form>
	);
};

export default Filter;
