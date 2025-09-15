import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
import Home from "./Pages/Home/Home";
import { createBrowserHistory } from "history";
import HomeTemplate from "./Pages/Template/HomeTemplate";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
export const routeLink: any = createBrowserHistory();

export function App() {
  return (
    <>
      {/* <Provider store={store}> */}
      <HistoryRouter history={routeLink}>
        <Routes>
          <Route path="/" element={<HomeTemplate />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </HistoryRouter>
      {/* </Provider> */}
    </>
  );
}

export default App;
