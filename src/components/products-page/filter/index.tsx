import React from 'react';
import styles from './styles.module.scss';

interface Props {
	filters: {
		product: string;
		price: string;
		brand: string;
	};
	handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	applyFilters: () => void;
}

const ProductFilter: React.FC<Props> = ({ filters, handleFilterChange, applyFilters }) => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};
	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<input
				name='product'
				type='text'
				placeholder='Наименование'
				value={filters.product}
				onChange={handleFilterChange}
			/>
			<input name='price' type='number' placeholder='Цена' value={filters.price} onChange={handleFilterChange} />
			<input name='brand' type='text' placeholder='Бренд' value={filters.brand} onChange={handleFilterChange} />
			<button type='submit' onClick={applyFilters}>
				Применить
			</button>
		</form>
	);
};

export default ProductFilter;
