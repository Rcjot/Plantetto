import { RouterProvider, createBrowserRouter } from "react-router-dom";
import getRoutes from "./routes/router";

function App() {
    const router = createBrowserRouter(getRoutes());

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
