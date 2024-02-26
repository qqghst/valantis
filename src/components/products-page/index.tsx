import React, { useCallback, useEffect, useState } from 'react';
import { fetchItems } from '../../libs/api';
import styles from './styles.module.scss';
import ButtonTwoCircles from '../../ui/buttons';
import Loader from '../../ui/loader';
import Filter from './filter';

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
	const [page, setPage] = useState<number>(0);
	const LIMIT = 50;
	const [filter, setFilter] = useState<Filters>({
		product: '',
		price: '',
		brand: '',
	});

	const handleFilterChange = useCallback((e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setFilter((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const fetchProducts = async () => {
		setIsLoading(true);
		try {
			let idsResult = await fetchItems('get_ids', { offset: page * LIMIT, limit: LIMIT });

			if (
				filter.product ||
				(filter.price && !isNaN(parseFloat(filter.price)) && filter.price.trim() !== '') ||
				filter.brand
			) {
				const filteredIds = await fetchItems('filter', {
					product: filter.product,
					price: parseFloat(filter.price),
					brand: filter.brand,
				});

				idsResult = idsResult.filter((id: any) => filteredIds.includes(id));
			}
			if (idsResult.length > 0) {
				const itemsResult = await fetchItems('get_items', { ids: idsResult });

				const itemsMap = new Map();
				itemsResult.forEach((item: { id: any }) => {
					if (!itemsMap.has(item.id)) {
						itemsMap.set(item.id, item);
					}
				});

				setProducts(Array.from(itemsMap.values()));
			} else {
				setProducts([]);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [page, filter]);

	return (
		<>
			<div>
				<div className={styles.buttonsFiltes}>
					<Filter filter={filter} onFilterChange={handleFilterChange} />

					{/* <ButtonTwoCircles
						nextSlide={() => {
							setPage(page - 1);
						}}
						prevSlide={() => {
							setPage(page + 1);
						}}
					/> */}
					<ButtonTwoCircles
						prevSlide={() => setPage((oldPage) => Math.max(0, oldPage - 1))}
						nextSlide={() => setPage((oldPage) => oldPage + 1)}
					/>
				</div>
				<div>
					<input
						type='text'
						placeholder='Product name'
						name='product'
						value={filter.product}
						onChange={handleFilterChange}
					/>
					<input
						type='number'
						placeholder='Price'
						name='price'
						value={filter.price}
						onChange={handleFilterChange}
					/>
					<input
						type='text'
						placeholder='Brand'
						name='brand'
						value={filter.brand}
						onChange={handleFilterChange}
					/>
					<button onClick={fetchProducts}>Apply Filters</button>
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
			</div>
		</>
	);
};

export default ProductsPage;
