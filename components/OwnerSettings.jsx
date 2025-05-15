"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { baseUrl } from '@/lib/config';

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const tabs = ["Profile Settings", "Password", "Futsal Preferences"];

  const [initialProfile, setInitialProfile] = useState({});
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
  });

  const [futsal, setFutsal] = useState({
    _id: "",
    futsalName: "",
    location: "",
    pricePerHour: "",
    contactNumber: "",
    description: "",
    facilities: "",
    images: [],
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFutsalImageUploading, setIsFutsalImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session) return toast.error("You are not logged in");

      try {
        setIsLoading(true);
        
        // Fetch user profile and futsal data in parallel
        const [profileRes, futsalRes] = await Promise.all([
          fetch(`${baseUrl}/api/users/${session.user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${baseUrl}/api/by-owner?ownerId=${session.user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })
        ]);

        const profileData = await profileRes.json();
        const futsalData = await futsalRes.json();
        console.log("Futsal API Response:", futsalData);
        console.log("Profile data:",profileData);
        console.log(profileData.success);
        console.log(futsalData.success);

        
        if (profileData.success) {
          console.log("Profile data fetched successfully:", profileData);
          setProfile(profileData.user);  // Use profileData.user
          setInitialProfile(profileData.user);  // Use profileData.user
        } else {
          toast.error("Failed to fetch profile");
        }
        

        if (futsalData.success) {
          setFutsal(futsalData.futsal);
        } else {
          toast.error("Failed to fetch futsal data");
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleFutsalChange = (e) => {
    const { name, value } = e.target;
    setFutsal((prev) => ({ ...prev, [name]: value }));
  };

  const getChangedFields = () => {
    const updated = {};
    for (const key in profile) {
      if (profile[key] !== initialProfile[key]) {
        updated[key] = profile[key];
      }
    }
    return updated;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
  
    const payload = getChangedFields(); // Assume this function returns the changed fields
    if (Object.keys(payload).length === 0) {
      return toast.error("No changes made");
    }
  
    // Get the userId from the session or context
    const session = await getSession();
    if (!session) return toast.error("You are not logged in");
    
    try {
      const res = await fetch(`${baseUrl}/api/users/profile/${session.user.id}`, {
        method: "PUT", // Use PUT for updating the profile
        headers: { "Content-Type": "application/json" },
        credentials: "include", // If needed for session/cookies
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated!");
        setInitialProfile({ ...initialProfile, ...payload }); // Update the state with new profile data
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
  
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords don't match");
    }
  
    try {
      // Get the session using getSession
      const session = await getSession();
      if (!session) {
        return toast.error("You are not logged in");
      }
  
      // Proceed with password change if the session exists
      const res = await fetch(`${baseUrl}/api/users/change-password/${session.user.id}`, {
        method: "PUT", // Use PUT for updating the password
        headers: { "Content-Type": "application/json" },
        credentials: "include", // If needed for session/cookies
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully!");
        setPasswords({ current: "", new: "", confirm: "" }); // Clear the password fields
      } else {
        toast.error(data.message || "Password change failed");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong");
    }
  };
  
  const handleDeleteImage = () => {
    setProfile((prev) => ({ ...prev, profileImage: "" }));
    toast.success("Profile image removed");
  };

  const handleDeleteFutsalImage = (index) => {
    setFutsal((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const handleFutsalSubmit = async (e) => {
    e.preventDefault();
    console.log("form submitted");
    
    if (isLoading) return toast.error("Data is still loading, please wait...");
  if (!futsal._id) {
    console.error("Missing futsal ID in:", futsal);
    return toast.error("Futsal ID is missing");
  }
  
    try {
      // Only send changed fields to allow partial updates
      const futsalData = {
        ...(futsal.futsalName && { futsalName: futsal.futsalName }),
        ...(futsal.location && { location: futsal.location }),
        ...(futsal.pricePerHour && { pricePerHour: futsal.pricePerHour }),
        ...(futsal.contactNumber && { contactNumber: futsal.contactNumber }),
        ...(futsal.description && { description: futsal.description }),
        ...(futsal.facilities && { facilities: futsal.facilities }),
        ...(futsal.images && { images: futsal.images }),
      };
  
      // Check if there are actually changes
      if (Object.keys(futsalData).length === 0) {
        return toast.error("No changes detected");
      }
  
      const res = await fetch(`${baseUrl}/api/futsals/update/${futsal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(futsalData),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Futsal updated successfully!");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating futsal:", error);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex justify-center space-x-6 border-b border-gray-200 bg-white shadow-sm px-6 py-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
          {activeTab === "Profile Settings" && (
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["name", "email", "phoneNumber"].map((field) => (
                  <div key={field} className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field === "phoneNumber"
                        ? "Phone Number"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      name={field}
                      value={profile[field] || ""}
                      onChange={handleProfileChange}
                      readOnly={field === "email"}
                      className={`w-full px-3 py-2 border rounded-md bg-white ${
                        profile[field] !== initialProfile[field]
                        ? "border-green-500"
                        : "border-gray-300"
                    } ${field === "email" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <label className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <Image
                    src={profile.profileImage || "/default-avatar.png"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full border object-cover"
                  />
                  {profile.profileImage && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <UploadButton
                    endpoint="profileImageUploader"
                    appearance={{
                      button: `bg-green-600 text-white rounded-md px-4 py-2 ${
                        isImageUploading ? "opacity-50" : ""
                      }`,
                      allowedContent: "text-sm text-gray-500",
                    }}
                    onUploadBegin={() => setIsImageUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsImageUploading(false);
                      const url = res?.[0]?.url;
                      if (url) {
                        setProfile((prev) => ({ ...prev, profileImage: url }));
                        toast.success("Profile image uploaded!");
                      }
                    }}
                    onUploadError={(error) => {
                      setIsImageUploading(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  {isImageUploading && (
                    <div className="text-sm text-gray-500">Uploading...</div>
                  )}
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === "Password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                    required
                    minLength={6}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "Futsal Preferences" && (
            <form onSubmit={handleFutsalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "futsalName",
                  "location",
                  "pricePerHour",
                  "contactNumber",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field === "pricePerHour" ? "number" : "text"}
                      name={field}
                      value={futsal[field] || ""}
                      onChange={handleFutsalChange}
                      className="w-full px-3 py-2 border rounded-md border-gray-300"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={futsal.description || ""}
                  onChange={handleFutsalChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facilities
                </label>
                <textarea
                  name="facilities"
                  value={futsal.facilities || ""}
                  onChange={handleFutsalChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                  rows={4}
                  placeholder="List facilities separated by commas"
                />
              </div>

              <div className="pt-4 space-y-2">
                <label className="block text-sm font-medium mb-1">
                  Futsal Images
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-wrap justify-center gap-4">
                    {futsal.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt="Futsal Image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteFutsalImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <UploadButton
                    endpoint="futsalImageUploader"
                    appearance={{
                      button: `bg-green-600 text-white rounded-md px-4 py-2 ${
                        isFutsalImageUploading ? "opacity-50" : ""
                      }`,
                      allowedContent: "text-sm text-gray-500",
                    }}
                    onUploadBegin={() => setIsFutsalImageUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsFutsalImageUploading(false);
                      const url = res?.[0]?.url;
                      if (url) {
                        setFutsal((prev) => ({
                          ...prev,
                          images: [...prev.images, url],
                        }));
                        toast.success("Image uploaded!");
                      }
                    }}
                    onUploadError={(error) => {
                      setIsFutsalImageUploading(false);
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  {isFutsalImageUploading && (
                    <div className="text-sm text-gray-500">Uploading...</div>
                  )}
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary text-white px-6 py-2 rounded-md shadow"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}