import mongoose from 'mongoose';

const breedSchema = new mongoose.Schema({
    species: {
        type: String,
        enum: ['Dog', 'Cat'],
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    origin: {
        type: String,
        trim: true
    },
    characteristics: {
        weightRange: { type: String }, 
        heightRange: { type: String }, 
        lifeSpan: { type: String },    
        temperament: [{ type: String }] 
    },
    careAdvice: {
        nutrition: { type: String },
        exercise: { type: String },
        grooming: { type: String }
    },
    aiIdentificationTags: [{ 
        type: String, 
        lowercase: true, 
        trim: true 
    }],
    sampleImages: [{ type: String }],
    briefDescription: { 
        type: String 
    },
    schemaVersion: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true 
});

breedSchema.index({ species: 1, name: 1 });

// Sử dụng Named Export
export const Breed = mongoose.model('Breed', breedSchema);