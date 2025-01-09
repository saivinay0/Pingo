import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL = "http://localhost:8000";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");

            set({ authUser: response.data });
            get().connectSocket();

        } catch (error) {
            set({ authUser: null });
            console.error(error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: response.user });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.conected) return
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },

}));