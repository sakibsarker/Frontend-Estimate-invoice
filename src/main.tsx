import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { store } from "./store";
import { Provider } from "react-redux";
import i18n from "./lib/i18n";
import { I18nextProvider } from "react-i18next";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppRoutes />
      </I18nextProvider>
    </Provider>
  </BrowserRouter>
);
