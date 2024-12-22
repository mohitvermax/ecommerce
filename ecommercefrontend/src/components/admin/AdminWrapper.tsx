import React from "react";
import { useRouter } from "next/navigation";

// Define the type for the props that the WrappedComponent will receive
type WrappedComponentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow any additional props
};

// Define the type for the HOC
const withAdminAuth = (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
  const AdminAuthWrapper: React.FC<WrappedComponentProps> = (props) => {
    const router = useRouter();
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      router.push("/admin/login"); // Redirect to login if not authenticated
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AdminAuthWrapper;
};

export default withAdminAuth;