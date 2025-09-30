import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./Pages/Home/Home";
import { createBrowserHistory } from "history";
import HomeTemplate from "./Pages/Template/HomeTemplate";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import RoomDetail from "./Pages/Detail/RoomDetail";
import Page404 from "./Pages/Orther/Page404";
import ComingSoon from "./Pages/Orther/ComingSoon";

import UserDetail from "./Pages/User/UserDetail";

import AdminTemplate from "./Pages/Template/AdminTemplate";
import Admin from "./Pages/Admin/Admin";
import RoomManageMent from "./Pages/Admin/ComponentAdmin/RoomManageMent";
import FormRoomManageMent from "./Pages/Admin/ComponentAdmin/FormRoomManageMent";
import UserInfoUpdate from "./Pages/User/ComponentUser/UserInfoUpdate";

export const routeLink: any = createBrowserHistory();

export function App() {
  return (
    <>
      <Provider store={store}>
        <HistoryRouter history={routeLink}>
          <Routes>
            <Route path="/" element={<HomeTemplate />}>
              <Route path="detail">
                <Route path=":id" element={<RoomDetail />} />
              </Route>
              <Route path="vehicle" element={<ComingSoon />} />
              <Route path="service" element={<ComingSoon />} />
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              <Route path="user">
                <Route path=":id" element={<UserDetail />} />
                <Route path="edit/:id" element={<UserInfoUpdate />} />
              </Route>
              <Route path="*" element={<Page404 />} />
            </Route>
            <Route path="/admin" element={<AdminTemplate />}>
              <Route index element={<Admin />} />
              <Route path="user">
                <Route path=":id" element={<UserDetail />} />
              </Route>
              <Route path="room" element={<RoomManageMent />} />
              <Route path="roomedit">
                <Route path=":id" element={<FormRoomManageMent />} />
              </Route>
              <Route path="roomaddnew" element={<FormRoomManageMent />} />
            </Route>
          </Routes>
        </HistoryRouter>
      </Provider>
    </>
  );
}

export default App;
