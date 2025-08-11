import React, { useEffect, useMemo } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";

// Lazy load components for better performance
const Dashboard = React.lazy(() => import("./components/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./components/user/Profile"));
const Login = React.lazy(() => import("./components/auth/Login"));
const Signup = React.lazy(() => import("./components/auth/Signup"));
const YourRepositories = React.lazy(() =>
  import("./components/repo/YourRepositories")
);
const SpecificProfile = React.lazy(() =>
  import("./components/user/SpecificProfile")
);
const EditProfile = React.lazy(() => import("./components/user/EditProfile"));
const Followers = React.lazy(() => import("./components/user/Followers"));
const Following = React.lazy(() => import("./components/user/Following"));
const SpecificRepo = React.lazy(() => import("./components/repo/SpecificRepo"));
const CreateRepo = React.lazy(() => import("./components/repo/CreateRepo"));
const EditRepo = React.lazy(() => import("./components/repo/EditRepo"));
const CreateIssue = React.lazy(() => import("./components/issue/CreateIssue"));
const EditIssue = React.lazy(() => import("./components/issue/EditIssue"));
const SpecificIssue = React.lazy(() =>
  import("./components/issue/SpecificIssue")
);
const StarRepos = React.lazy(() => import("./components/user/StarRepos"));
const NavSearch = React.lazy(() =>
  import("./components/navComponents/Navsearch")
);
const ForgotPassword = React.lazy(() =>
  import("./components/auth/ForgotPassword")
);
const VerifyOtp = React.lazy(() => import("./components/auth/VerifyOtp"));
const ResetPassword = React.lazy(() =>
  import("./components/auth/ResetPassword")
);
const Documentation = React.lazy(() =>
  import("./components/navComponents/Documentation")
);
const AboutUs = React.lazy(() => import("./components/navComponents/AboutUs"));
// Import authentication context
import { useAuth } from "./authContext";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/auth",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

// Define authenticated routes that should redirect to home if user is logged in
const AUTH_ROUTES = ["/auth", "/signup", "/forgot-password"];

// Loading component for lazy loading
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is public
  const isPublicRoute = useMemo(
    () => PUBLIC_ROUTES.some((route) => location.pathname.startsWith(route)),
    [location.pathname]
  );

  // Check if current route is an auth route
  const isAuthRoute = useMemo(
    () => AUTH_ROUTES.some((route) => location.pathname === route),
    [location.pathname]
  );

  useEffect(() => {
    // Get userId from localStorage
    const userIdFromStorage = localStorage.getItem("userId");

    // Sync user from localStorage to context if needed
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    // Redirect logic
    if (!userIdFromStorage && !isPublicRoute) {
      // Redirect to login if not authenticated and not on a public route
      navigate("/auth", { state: { from: location.pathname }, replace: true });
    } else if (userIdFromStorage && isAuthRoute) {
      // Redirect to home if authenticated and on an auth route
      navigate("/", { replace: true });
    }
  }, [
    currentUser,
    navigate,
    setCurrentUser,
    isPublicRoute,
    isAuthRoute,
    location.pathname,
  ]);

  // Define app routes with React.Suspense for lazy loading
  const element = useRoutes([
    {
      path: "/",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Dashboard />
        </React.Suspense>
      ),
    },
    {
      path: "/auth",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Login />
        </React.Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Signup />
        </React.Suspense>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <React.Suspense fallback={<Loading />}>
          <ForgotPassword />
        </React.Suspense>
      ),
    },
    {
      path: "/verify-otp",
      element: (
        <React.Suspense fallback={<Loading />}>
          <VerifyOtp />
        </React.Suspense>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <React.Suspense fallback={<Loading />}>
          <ResetPassword />
        </React.Suspense>
      ),
    },
    // Protected routes
    {
      path: "/profile",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Profile />
        </React.Suspense>
      ),
    },
    {
      path: "/yourRepos",
      element: (
        <React.Suspense fallback={<Loading />}>
          <YourRepositories />
        </React.Suspense>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <SpecificProfile />
        </React.Suspense>
      ),
    },

    {
      path: "/EditProfile",
      element: (
        <React.Suspense fallback={<Loading />}>
          <EditProfile />
        </React.Suspense>
      ),
    },
    {
      path: "/profile/viewFollowers",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Followers />
        </React.Suspense>
      ),
    },
    {
      path: "/profile/viewFollowing",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Following />
        </React.Suspense>
      ),
    },
    {
      path: "/repo/user/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <SpecificRepo />
        </React.Suspense>
      ),
    },
    {
      path: "/repo/create",
      element: (
        <React.Suspense fallback={<Loading />}>
          <CreateRepo />
        </React.Suspense>
      ),
    },
    {
      path: "/repo/update/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <EditRepo />
        </React.Suspense>
      ),
    },
    {
      path: "/issue/create/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <CreateIssue />
        </React.Suspense>
      ),
    },
    {
      path: "/issue/update/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <EditIssue />
        </React.Suspense>
      ),
    },
    {
      path: "/issue/:id",
      element: (
        <React.Suspense fallback={<Loading />}>
          <SpecificIssue />
        </React.Suspense>
      ),
    },
    {
      path: "/starRepos",
      element: (
        <React.Suspense fallback={<Loading />}>
          <StarRepos />
        </React.Suspense>
      ),
    },
    {
      path: "/navSearch/:query",
      element: (
        <React.Suspense fallback={<Loading />}>
          <NavSearch />
        </React.Suspense>
      ),
    },
    {
      path: "/docs",
      element: (
        <React.Suspense fallback={<Loading />}>
          <Documentation />
        </React.Suspense>
      ),
    },
    {
      path: "/about",
      element: (
        <React.Suspense fallback={<Loading />}>
          <AboutUs />
        </React.Suspense>
      ),
    },
  ]);

  return element;
};

export default ProjectRoutes;
