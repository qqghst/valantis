import React from 'react';
import styles from './styles.module.scss';

const Loader: React.FC = () => {
	return (
		<>
			<div className={styles.loaderContainer}>
				<div className={styles.loaderGrid}>
					<div className={styles.item1} />
					<div className={styles.item2} />
					<div className={styles.item3} />
					<div className={styles.item4} />
				</div>
				<h3 className={styles.text}>Загрузка...</h3>
			</div>
		</>
	);
};

export default Loader;
