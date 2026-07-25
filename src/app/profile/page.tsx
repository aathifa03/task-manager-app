"use client";

import { useState, FormEvent, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile, updatePassword } from "@/services/auth.service";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState({ error: "", success: "" });
  const [passwordMsg, setPasswordMsg] = useState({ error: "", success: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMsg({ error: "", success: "" });

    if (!name.trim()) {
      setProfileMsg({ error: "Name cannot be empty.", success: "" });
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await updateProfile({ name });
      const msg = res.message || "Profile updated successfully!";
      setProfileMsg({ error: "", success: msg });
      toast.success(msg);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      setProfileMsg({ error: msg, success: "" });
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ error: "", success: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      const msg = "All password fields are required.";
      setPasswordMsg({ error: msg, success: "" });
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "New passwords do not match.";
      setPasswordMsg({ error: msg, success: "" });
      toast.error(msg);
      return;
    }

    if (newPassword.length < 6) {
      const msg = "New password must be at least 6 characters.";
      setPasswordMsg({ error: msg, success: "" });
      toast.error(msg);
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await updatePassword({ currentPassword, newPassword });
      const msg = res.message || "Password updated successfully!";
      setPasswordMsg({ error: "", success: msg });
      toast.success(msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setPasswordMsg({ error: msg, success: "" });
      toast.error(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Account Profile</h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Manage your personal credentials and security settings.
            </p>
          </div>

          <div className="grid gap-5">
            {/* User Overview Card */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 text-sm font-extrabold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Update Card */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Edit Display Name</h3>
              
              {profileMsg.error && (
                <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs text-red-600 dark:text-red-400">
                  {profileMsg.error}
                </div>
              )}
              {profileMsg.success && (
                <div className="mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs text-emerald-600 dark:text-emerald-400">
                  {profileMsg.success}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingProfile ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </div>

            {/* Password Update Card */}
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Change Password</h3>

              {passwordMsg.error && (
                <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-xs text-red-600 dark:text-red-400">
                  {passwordMsg.error}
                </div>
              )}
              {passwordMsg.success && (
                <div className="mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs text-emerald-600 dark:text-emerald-400">
                  {passwordMsg.success}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingPassword ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
