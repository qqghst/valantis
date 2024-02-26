import React, { useCallback, useEffect, useState } from 'react';
import { fetchData } from '../../libs/api';
import styles from './styles.module.scss';
import ButtonTwoCircles from '../../ui/buttons';
import ProductFilter from './filter';
import Loader from '../../ui/loader';

interface Product {
	id: string;
	product: string;
	price: number;
	brand: string;
}

interface Filters {
	product: string;
	price: string;
	brand: string;
}

const ProductsPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [page, setPage] = useState(0);
	const limit = 50;

	//фильтрация
	const [filters, setFilters] = useState<Filters>({
		product: '',
		price: '',
		brand: '',
	});

	const fetchProducts = useCallback(async (offset = 0, appliedFilters: Filters) => {
		setIsLoading(true);
		try {
			let idsResponse;
			const filterParams: { [key: string]: any } = {};

			if (appliedFilters.product) {
				filterParams.product = appliedFilters.product;
			}
			if (appliedFilters.price && !isNaN(parseFloat(appliedFilters.price))) {
				filterParams.price = parseFloat(appliedFilters.price);
			}
			if (appliedFilters.brand) {
				filterParams.brand = appliedFilters.brand;
			}

			if (Object.keys(filterParams).length) {
				idsResponse = await fetchData('filter', filterParams);
			} else {
				idsResponse = await fetchData('get_ids', { offset, limit });
			}

			if (idsResponse && idsResponse.result) {
				const uniqueIds = [...new Set(idsResponse.result)];
				const itemsResponse = await fetchData('get_items', { ids: uniqueIds });
				if (itemsResponse && itemsResponse.result) {
					setProducts(itemsResponse.result);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts(page * limit, filters);
	}, [page, fetchProducts]);

	const handleFilterChange = useCallback((e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}));
	}, []);

	const applyFilters = useCallback(() => {
		setPage(0);
		fetchProducts(0, filters);
	}, [filters]);

	return (
		<>
			<div className={styles.buttonsFiltes}>
				<ProductFilter filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters} />
				<ButtonTwoCircles
					nextSlide={() => setPage((prev) => prev - 1)}
					prevSlide={() => setPage((prev) => prev + 1)}
				/>
			</div>

			{isLoading ? (
				<Loader />
			) : (
				<div className={styles.productsContainer}>
					{products.map((item, index) => (
						<div className={styles.product} key={index}>
							<span className={styles.title}>{item.product}</span>
							<span className={styles.price}>{item.price} руб.</span>
							<span className={styles.brand}>Бренд: {item.brand || 'empty for now'}</span>
							<span className={styles.id}>ID: {item.id}</span>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default ProductsPage;
