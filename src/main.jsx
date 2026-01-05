import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { store, persistor } from "./redux/store";
import { setAuthHeader } from "./redux/api/privateAPI";
import { getCookie } from "./utils/cookies.js";

// восстановление accessToken при старте
const token =
  getCookie("accessToken") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token");
if (token) {
  setAuthHeader(token);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
