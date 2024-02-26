import React from 'react';
import styles from './styles.module.scss';

interface IButtonTwoCirclesProps {
	nextSlide: any;
	prevSlide: any;
}

const ButtonTwoCircles: React.FC<IButtonTwoCirclesProps> = ({ nextSlide, prevSlide }) => {
	return (
		<div className={styles.circleContainer}>
			<button className={styles.leftButton} onClick={prevSlide}>
				<span>&larr;</span>
			</button>
			<button className={styles.rightButton} onClick={nextSlide}>
				<span>&rarr;</span>
			</button>
			<div className={styles.circle} />
		</div>
	);
};

export default ButtonTwoCircles;
