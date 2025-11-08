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
import ComingSoon from "@/pages/dev/ComingSoon";

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
                        {
                            path: "/explore",
                            element: <ComingSoon />,
                        },
                        {
                            path: "/market",
                            element: <ComingSoon />,
                        },
                        {
                            path: "/guides",
                            element: <ComingSoon />,
                        },
                        {
                            path: "/plantdiaries",
                            element: <ComingSoon />,
                        },
                        {
                            path: "/bookmarks",
                            element: <ComingSoon />,
                        },
                        {
                            path: "/settings",
                            element: <ComingSoon />,
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
