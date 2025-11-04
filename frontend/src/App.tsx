import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-image-crop/dist/ReactCrop.css";
import getRoutes from "./routes/router";
import AuthProvider from "./features/auth/AuthProvider";

function App() {
    const router = createBrowserRouter(getRoutes());

    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </>
    );
}

export default App;
