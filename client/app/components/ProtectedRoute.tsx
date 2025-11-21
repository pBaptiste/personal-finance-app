import { Navigate } from "react-router";
import { isAuthenticated } from "~/lib/auth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isClient, setIsClient] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setAuthenticated(isAuthenticated());
    }, []);

    // During SSR, render children (will be checked on client)
    if (!isClient) {
        return <>{children}</>;
    }

    // On client, check authentication
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}