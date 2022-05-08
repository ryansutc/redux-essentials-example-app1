import store from './store'

/**
 * This is a trick to export the type description
 * of our Redux store dynamically. We can pass this to
 * custom hooks to make sure that they are type-safe.
 * 
 * These types are used in app/hooks.ts
 * See:
 * https://react-redux.js.org/using-react-redux/usage-with-typescript#define-root-state-and-dispatch-types
 */
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch