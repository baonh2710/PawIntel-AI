import mongoose from 'mongoose';

const funFactSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true,
        trim: true
    },
    category: { 
        type: String, 
        enum: ['General', 'Dog', 'Cat', 'BreedSpecific'],
        required: true,
        index: true 
    },
    breedId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Breed',
        default: null 
    },
    isActive: {
        type: Boolean,
        default: true
    },
    schemaVersion: {
        type: Number,
        default: 1
    }
}, { 
    timestamps: true 
});

// Sử dụng Named Export
export const FunFact = mongoose.model('FunFact', funFactSchema);