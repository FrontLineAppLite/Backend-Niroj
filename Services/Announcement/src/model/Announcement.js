const mongoose = require('mongoose');

// Schema for Announcement
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Announcement title
    description: { type: String, required: true }, // Announcement description
    attachments: [{ type: String }], // File paths of attachments
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked this announcement
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who commented
            text: { type: String, required: true }, // Text of the comment
            timestamp: { type: Date, default: Date.now }, // Comment timestamp
        }
    ],
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the model
module.exports = mongoose.model('Announcement', announcementSchema);