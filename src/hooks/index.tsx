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
	const limit = 4;

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
				filterParams.limit = limit;
				filterParams.offset = offset;
				idsResponse = await fetchData('filter', filterParams);
				console.log('Fetching products with params:', { offset, limit, ...filterParams });
			} else {
				idsResponse = await fetchData('get_ids', { offset, limit });
			}

			if (idsResponse && idsResponse.result) {
				const uniqueIds = [...new Set(idsResponse.result)];

				console.log(`Total unique IDs fetched: ${uniqueIds.length}`);

				const limitedUniqueIds = uniqueIds.slice(0, limit);

				const itemsResponse = await fetchData('get_items', { ids: limitedUniqueIds });
				if (itemsResponse && itemsResponse.result) {
					const uniqueProducts = itemsResponse.result.filter(
						(v: any, i: any, a: any) => a.findIndex((t: any) => t.id === v.id) === i,
					);
					setProducts(uniqueProducts);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

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
	}, [filters, fetchProducts]);

	useEffect(() => {
		fetchProducts(page * limit, filters);
	}, [page, fetchProducts, filters]);

	return (
		<>
			<div className={styles.buttonsFiltes}>
				<ProductFilter filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters} />

				<ButtonTwoCircles
					nextSlide={() => {
						const nextPage = page + 1;
						setPage(nextPage);
						fetchProducts(nextPage * limit, filters);
					}}
					prevSlide={() => {
						const prevPage = Math.max(page - 1, 0);
						setPage(prevPage);
						fetchProducts(prevPage * limit, filters);
					}}
				/>
			</div>

			{isLoading ? (
				<Loader />
			) : (
				<div className={styles.productsContainer}>
					{products.map((item, index) => (
						<div className={styles.product} key={item.id}>
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
