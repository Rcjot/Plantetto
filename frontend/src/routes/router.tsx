import MasterLayout from "../layouts/MasterLayout";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../pages/auth/Signup";
import Signin from "@/pages/auth/Signin";
import LandingPage from "../pages/landingPages/LandingPage";
import Home from "../pages/home/Home";
import MyGarden from "../pages/garden/MyGarden";
import Profile from "../pages/profile/Profile";
import PostDialog from "@/features/posts/PostDialog";

function getRoutes() {
    return [
        {
            element: <PublicRoute />,
            children: [
                {
                    path: "/signin",
                    element: <Signin />,
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
                    element: <MasterLayout />,
                    children: [
                        {
                            path: "/home",
                            element: <Home />,
                            children: [
                                {
                                    path: "/home/:username/:post_uuid",
                                    element: <PostDialog />,
                                },
                            ],
                        },
                        {
                            path: "/mygarden",
                            element: <MyGarden />,
                        },
                        {
                            path: "/:username",
                            element: <Profile />,
                        },
                    ],
                },
            ],
        },
        {
            path: "*",
            element: <div>error</div>,
        },
    ];
}

export default getRoutes;