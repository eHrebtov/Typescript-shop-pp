import { configureStore } from '@reduxjs/toolkit'
import { shopApi } from './api'
import authSlice from './slices/authSlice'
import cartSlice from './slices/cartSlice'

export const store = configureStore({
	reducer: {
		[shopApi.reducerPath]: shopApi.reducer,
		authReducer: authSlice,
		cartReducer: cartSlice,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(shopApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
