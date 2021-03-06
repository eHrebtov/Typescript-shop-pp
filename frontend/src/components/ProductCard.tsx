import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ProductProps } from '../types'
import Rating from './Rating'

const Product = ({ product }: ProductProps) => {
	return (
		<Card className='my-3 p-3 rounded'>
			<Link to={`/product/${product.id}`}>
				<Card.Img src={product.image} variant='top' />
			</Link>

			<Card.Body className='p-1 text-center'>
				<Link to={`/product/${product.id}`}>
					<Card.Title as='div'>
						<strong>{product.name}</strong>
					</Card.Title>
				</Link>

				<Card.Text as='div'>
					<Rating
						value={parseFloat(product.rating)}
						text={`(${product.numReviews})`}
					/>
				</Card.Text>

				<Card.Text as='h4'>${product.price}</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default Product
