import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux'

import type {
  AppDispatch,
  RootState,
} from './store_type'

// We use these instead of vanilla Redux useSelector and useDispatch
// throughout our app because with these we have type checking!
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector