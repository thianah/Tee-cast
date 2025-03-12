import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-500 text-white">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="mt-4 px-4 py-2 bg-gray-800 rounded-lg">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
