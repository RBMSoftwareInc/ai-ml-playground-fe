import { configureStore } from '@reduxjs/toolkit';

// Create a basic Redux store
const store = configureStore({
  reducer: {}, // No reducers needed for react-beautiful-dnd
});

// Export the store
export default store;

// Export the store's type for TypeScript (optional, but good practice)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;