import { createBrowserRouter } from "react-router";

import RootLayout    from "../layouts/RootLayout/RootLayout";
import AuthLayout    from "../layouts/AuthLayout/AuthLayout";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";

import Home          from "../pages/Home/Home/Home";
import AllItems      from "../pages/AllItems/AllItems";
import Center        from "../pages/Center/Center";
import ViewDetails   from "../pages/ViewDetails/ViewDetails";

import Login         from "../pages/Authentication/Login/Login";
import Register      from "../pages/Authentication/Register/Register";

import AddItems      from "../pages/AddItems/AddItems";
import AllRecovered  from "../pages/AllRecovered/AllRecovered";
import ManageMyItems from "../pages/ManageMyItems/ManageMyItems";

import AdminItems from "../pages/AdminItems/AdminItems";
import NotFound from "../pages/NotFound/NotFound";






export const router = createBrowserRouter([

  /* ── Main Layout ── */
  {
    path:      "/",
    Component: RootLayout,
    children: [

      /* Public */
      { index: true,            Component: Home      },
      { path: "allItems",       Component: AllItems  },
      { path: "center",         Component: Center    },

      /* Private — logged in users only */
      {
        path:    "items/:id",
        element: <PrivateRoute><ViewDetails /></PrivateRoute>,
      },
      {
        path:    "addItems",
        element: <PrivateRoute><AddItems /></PrivateRoute>,
      },
      {
        path:    "allRecovered",
        element: <PrivateRoute><AllRecovered /></PrivateRoute>,
      },
      {
        path:    "myItems",
        element: <PrivateRoute><ManageMyItems /></PrivateRoute>,
      },

      /* Admin only */
      {
        path:    "adminItems",
        element: <AdminRoute><AdminItems /></AdminRoute>,
      },

    ],
  },

  /* ── Auth Layout ── */
  {
    path:      "/",
    Component: AuthLayout,
    children: [
      { path: "login",    Component: Login    },
      { path: "register", Component: Register },
    ],
  },

  /* ── 404 ── */
  {
    path:      "*",
    Component: NotFound,
  },

]);