import mongoose from 'mongoose';

const petProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        default: "Thú cưng mới",
        trim: true
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat'],
        required: true
    },
    breedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Breed',
        default: null
    },
    weight: { type: Number },
    birthDate: { type: Date },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unknown'],
        default: 'Unknown'
    },
    avatarUrl: { 
        type: String 
    }, 
    schemaVersion: {
        type: Number,
        default: 1
    }
}, { 
    timestamps: true 
});

// Sử dụng Named Export
export const PetProfile = mongoose.model('PetProfile', petProfileSchema);