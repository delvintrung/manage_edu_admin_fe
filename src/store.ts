import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./Slice/role";
import orderReducer from "./Slice/order_status";
import productWait from "./Slice/products_wait";

const store = configureStore({
  reducer: {
    role: roleReducer,
    order_status: orderReducer,
    productsWait: productWait,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
