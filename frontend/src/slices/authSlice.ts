import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, TokensAndUser, UserDto } from '../types'

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: JSON.parse(localStorage.getItem('user') || 'null'),
		access_token: JSON.parse(localStorage.getItem('accessToken') || 'null'),
		refresh_token: null,
	} as AuthState,
	reducers: {
		setCredentials: (state, { payload }: PayloadAction<TokensAndUser>) => {
			state.access_token = payload.access_token
			localStorage.setItem('accessToken', JSON.stringify(payload.access_token))
			state.refresh_token = payload.refresh_token
			state.user = payload.user
			localStorage.setItem('user', JSON.stringify(payload.user))
		},
		setUser: (state, { payload }: PayloadAction<UserDto>) => {
			state.user = payload
			localStorage.setItem('user', JSON.stringify(payload))
		},
		logout: state => {
			state.access_token = null
			localStorage.removeItem('accessToken')
			state.refresh_token = null
			localStorage.removeItem('refreshToken')
			state.user = null
			localStorage.removeItem('user')
		},
		refresh: (state, { payload }: PayloadAction<any>) => {
			state.access_token = payload.access_token
			localStorage.setItem('accessToken', JSON.stringify(payload.access_token))
			state.refresh_token = payload.refresh_token
			state.user = payload.user
			localStorage.setItem('user', JSON.stringify(payload.user))
		},
	},
})

export const { setCredentials, logout, refresh, setUser } = authSlice.actions

export default authSlice.reducer
