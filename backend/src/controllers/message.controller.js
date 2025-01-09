import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getreceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = id;
        let imageurl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;
        }
        const newMessage = new Message({ senderId, receiverId, text, image: imageurl });
        await newMessage.save();
        const receiverSocketId = getreceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}