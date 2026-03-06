import type { Action } from '@reduxjs/toolkit';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import type { RootState } from './store';

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
