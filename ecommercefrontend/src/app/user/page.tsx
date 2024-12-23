"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  userId: string;
  accountStatus: string;
  phone: string;
}

const UserPage: React.FC = () => {
  const { userId } = useAuth();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://ecommerce-86ao.onrender.com//get-user-byid?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          const user = data.users.find((user: User) => user.userId === userId);
          if (user) {
            setUserDetails(user);
          } else {
            setError("User not found");
          }
        } else {
          setError(data.message || "Error fetching user details");
        }
      } catch (error) {
        setError("Failed to fetch user details");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userDetails) {
    return <div>No user details found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <strong>Name:</strong> {userDetails.name}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {userDetails.email}
        </div>
        <div className="mb-4">
          <strong>User ID:</strong> {userDetails.userId}
        </div>
        <div className="mb-4">
          <strong>Account Status:</strong> {userDetails.accountStatus}
        </div>
        <div className="mb-4">
          <strong>Phone:</strong> {userDetails.phone}
        </div>
      </div>
    </div>
  );
};

export default UserPage;