import MasterLayout from "../layouts/MasterLayout";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import LandingPage from "../pages/landingPages/LandingPage";
import Home from "../pages/home/Home";
import MyGarden from "../pages/garden/MyGarden";
import Profile from "../pages/profile/Profile";

function getRoutes() {
    return [
        {
            element: <MasterLayout />,
            children: [
                {
                    element: <PublicRoute />,
                    children: [
                        {
                            path: "/login",
                            element: <Login />,
                        },
                        {
                            path: "/signup",
                            element: <Signup />,
                        },
                        {
                            path: "/",
                            element: <LandingPage />,
                        },
                    ],
                },
                {
                    element: <ProtectedRoute />,
                    children: [
                        {
                            path: "/home",
                            element: <Home />,
                        },
                        {
                            path: "/mygarden",
                            element: <MyGarden />,
                        },
                        {
                            path: "/profile/:id",
                            element: <Profile />,
                        },
                    ],
                },
                {
                    path: "*",
                    element: <div>error</div>,
                },
            ],
        },
    ];
}

export default getRoutes;
