import { configureStore } from "@reduxjs/toolkit";

import { repairRequestApi } from "./features/server/repairRequestSlice";
import { customerApi } from "./features/server/customerSlice";
import { taxApi } from "./features/server/taxSlice";
import { discountApi } from "./features/server/discountSlice";
import { itemApi } from "./features/server/itemSlice";
import { invoiceApi } from "./features/server/invoiceSlice";
import { templateApi } from "./features/server/templateSlice";

export const store = configureStore({
  reducer: {
    [repairRequestApi.reducerPath]: repairRequestApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [discountApi.reducerPath]: discountApi.reducer,
    [taxApi.reducerPath]: taxApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(repairRequestApi.middleware)
      .concat(itemApi.middleware)
      .concat(customerApi.middleware)
      .concat(taxApi.middleware)
      .concat(discountApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(templateApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
