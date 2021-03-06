import { shopApi } from '.'
import { CreateOrderDto, Order, PaymentResult } from '../types'

const orderApi = shopApi.injectEndpoints({
	endpoints: build => ({
		createOrder: build.mutation<Order, CreateOrderDto>({
			query: createOrderDto => ({
				url: '/api/order',
				method: 'POST',
				body: createOrderDto,
				credentials: 'include',
			}),
		}),
		getPayPalConfig: build.query<{ clientId: string }, void>({
			query: () => `/api/order/paypalconfig`,
		}),
		getOrderById: build.query<Order, number>({
			query: id => `/api/order/${id}`,
		}),
		getAllUserOrders: build.query<Order[], void>({
			query: () => `/api/order/me`,
		}),
		updateOrderToPayed: build.mutation<
			Order,
			{ orderId: number; paymentResult: PaymentResult }
		>({
			query: arg => ({
				url: `/api/order/pay/${arg.orderId}`,
				method: 'PUT',
				body: arg.paymentResult,
				credentials: 'include',
			}),
		}),
		createPayPalOrder: build.mutation<{ orderId: string }, number>({
			query: orderId => ({
				url: '/api/order/PayPalOrder',
				method: 'POST',
				body: { orderId },
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateOrderMutation,
	useGetOrderByIdQuery,
	useUpdateOrderToPayedMutation,
	useGetPayPalConfigQuery,
	useGetAllUserOrdersQuery,
	useCreatePayPalOrderMutation,
} = orderApi
