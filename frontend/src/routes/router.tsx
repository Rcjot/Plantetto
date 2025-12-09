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

import Guides from "@/pages/guides/Guides";
import GuidesEditor from "@/pages/guides/GuidesEditor";
import GuidesBoard from "@/pages/guides/GuidesBoard";
import GuidesView from "@/pages/guides/GuidesView";

import Bookmarks from "@/pages/bookmarks/Bookmarks";

// Settings restored
import Settings from "@/pages/settings/Settings";
import SettingsAccount from "@/pages/settings/SettingsAccount";
import SettingsTerms from "@/pages/settings/SettingsTerms";
import SettingsPrivacy from "@/pages/settings/SettingsPrivacy";
import SettingsCookies from "@/pages/settings/SettingsCookies";
import SettingsStandards from "@/pages/settings/SettingsStandards";
import SettingsThemes from "@/pages/settings/SettingsThemes";

function getRoutes() {
    return [
        // PUBLIC ROUTES
        {
            element: <PublicRoute />,
            children: [
                { path: "/signin", element: <Signin /> },
                { path: "/signup", element: <Signup /> },
                { path: "/", element: <LandingPage /> },
            ],
        },

        // PROTECTED ROUTES
        {
            element: <ProtectedRoute />,
            children: [
                {
                    element: <MasterLayout />,
                    children: [
                        // HOME
                        {
                            path: "/home",
                            element: <Home />,
                            children: [
                                {
                                    // FIXED: relative child route
                                    path: ":username/:post_uuid",
                                    element: <PostDialog />,
                                },
                            ],
                        },

                        { path: "/mygarden", element: <MyGarden /> },

                        // PROFILE
                        { path: "/:username", element: <Profile /> },

                        // PLACEHOLDERS
                        { path: "/explore", element: <ComingSoon /> },
                        { path: "/market", element: <ComingSoon /> },

                        // GUIDES
                        { path: "/guides", element: <Guides /> },
                        { path: "/guides/board", element: <GuidesBoard /> },
                        { path: "/guides/:uuid/edit", element: <GuidesEditor /> },
                        { path: "/guides/:uuid", element: <GuidesView /> },

                        // PLANT DIARIES
                        { path: "/plantdiaries", element: <ComingSoon /> },

                    
                        {
                            path: "/bookmarks",
                            element: <Bookmarks />,
                            children: [
                                {
                                  
                                    path: ":username/:post_uuid",
                                    element: <PostDialog />,
                                },
                            ],
                        },

                     
                        { path: "/settings", element: <Settings /> },
                        {
                            path: "/settings/accountsinformation",
                            element: <SettingsAccount />,
                        },
                        { path: "/settings/themes", element: <SettingsThemes /> },
                        { path: "/settings/terms", element: <SettingsTerms /> },
                        { path: "/settings/privacy", element: <SettingsPrivacy /> },
                        { path: "/settings/cookies", element: <SettingsCookies /> },
                        { path: "/settings/standards", element: <SettingsStandards /> },
                    ],
                },
            ],
        },

        // NOT FOUND
        {
            path: "*",
            element: <div>error</div>,
        },
    ];
}

export default getRoutes;
