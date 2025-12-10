import MasterLayout from "../layouts/MasterLayout";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../pages/auth/Signup";
import Signin from "@/pages/auth/Signin";
import LandingPage from "../pages/landingPages/LandingPage";
import Home from "../pages/home/Home";
import MyGarden from "../pages/garden/MyGarden";
import Profile from "../pages/profile/Profile";
import ComingSoon from "@/pages/dev/ComingSoon";
import Guides from "@/pages/guides/Guides";
import GuidesEditor from "@/pages/guides/GuidesEditor";
import GuidesBoard from "@/pages/guides/GuidesBoard";
import GuidesView from "@/pages/guides/GuidesView";
import Explore from "@/pages/explore/Explore";
import Settings from "@/pages/settings/Settings";
import SettingsAccount from "@/pages/settings/SettingsAccount";
import SettingsTerms from "@/pages/settings/SettingsTerms";
import SettingsPrivacy from "@/pages/settings/SettingsPrivacy";
import SettingsCookies from "@/pages/settings/SettingsCookies";
import SettingsStandards from "@/pages/settings/SettingsStandards";
import SettingsThemes from "@/pages/settings/SettingsThemes";
import Market from "@/pages/market/Market";
import MarketItemPage from "@/pages/market/MarketItemPage";
import MyListings from "@/pages/market/MyListings";
import UsersPostFeedSection from "@/features/profile/subsections/UsersPostFeedSection";
import UsersGardenSection from "@/features/profile/subsections/UsersGardenSection";
import UsersPublishedGuidesSection from "@/features/profile/subsections/UsersPublishedGuidesSection";
import Bookmarks from "@/pages/bookmarks/Bookmarks";

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
                        },
                        {
                            path: "/mygarden",
                            element: <MyGarden />,
                        },
                        {
                            path: "/:username",
                            element: <Profile />,
                            children: [
                                {
                                    index: true,
                                    element: <UsersPostFeedSection />,
                                },
                                {
                                    path: "posts",
                                    element: <UsersPostFeedSection />,
                                },
                                {
                                    path: "plants",
                                    element: <UsersGardenSection />,
                                },
                                {
                                    path: "guides",
                                    element: <UsersPublishedGuidesSection />,
                                },
                            ],
                        },
                        {
                            path: "/explore",
                            element: <Explore />,
                        },
                        {
                            path: "/market",
                            element: <Market />,
                        },
                        {
                            path: "/market/:item_uuid",
                            element: <MarketItemPage />,
                        },
                        {
                            path: "/mylistings",
                            element: <MyListings />,
                        },
                        {
                            path: "/mylistings/:item_uuid",
                            element: <MarketItemPage />,
                        },
                        {
                            path: "/guides",
                            element: <Guides />,
                        },
                        {
                            path: "/guides/board",
                            element: <GuidesBoard />,
                        },
                        {
                            path: "/guides/:uuid/edit",
                            element: <GuidesEditor />,
                        },
                        {
                            path: "/guides/:uuid",
                            element: <GuidesView />,
                        },
                        {
                            path: "/plantdiaries",
                            element: <ComingSoon />,
                        },

                        {
                            path: "/bookmarks",
                            element: <Bookmarks />,
                        },
                        {
                            path: "/settings",
                            element: <Settings />,
                        },
                        {
                            path: "/settings/accountsinformation",
                            element: <SettingsAccount />,
                        },
                        {
                            path: "/settings/themes",
                            element: <SettingsThemes />,
                        },
                        {
                            path: "/settings/terms",
                            element: <SettingsTerms />,
                        },
                        {
                            path: "/settings/privacy",
                            element: <SettingsPrivacy />,
                        },
                        {
                            path: "/settings/cookies",
                            element: <SettingsCookies />,
                        },
                        {
                            path: "/settings/standards",
                            element: <SettingsStandards />,
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
