const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    TaskId: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Deadline: {
        type: Date,
        default: Date.now
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    }
});

module.exports = mongoose.model('task', TaskSchema, 'Tasks');
