import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import Home from "../../Pages/Home/Home";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import WriteBlog from "../../components/WriteBlog/WriteBlog";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import ContentPage from "../../Pages/ContentPage/ContentPage";

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/home',
                element: <Home></Home>
            },
            {
                path: '/new-blog',
                element: <WriteBlog></WriteBlog>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Register></Register>
            },
            {
                path: '/content/:id',
                loader: ({ params }) => fetch(`${process.env.REACT_APP_SERVER_LINK}/content/${params.id}`),
                element: <ContentPage></ContentPage>
            },
        ]
    }
])

export default routes;