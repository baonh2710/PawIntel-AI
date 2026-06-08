# app/core/config.py
import os

MODEL_PATH = "dog_breed_model.keras" # Bạn nhớ để file keras ngang hàng với thư mục app nhé
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "Afghan Hound", "African Wild Dog", "Airedale Terrier", "American Staffordshire Terrier",
    "Appenzeller Sennenhund", "Australian Terrier", "Bedlington Terrier", "Bernese Mountain Dog",
    "Blenheim Spaniel", "Border Collie", "Border Terrier",
    "Boston Terrier", "Bouvier des Flandres", "Brussels Griffon",
    "Brittany", "Cardigan Welsh Corgi", "Chesapeake Bay Retriever",
    "Chihuahua", "Dandie Dinmont Terrier", "Doberman Pinscher", "English Foxhound",
    "English Setter", "English Springer Spaniel", "Entlebucher Mountain Dog",
    "Eskimo Dog", "French Bulldog", "German Shepherd Dog",
    "German Shorthaired Pointer", "Gordon Setter", "Great Dane",
    "Great Pyrenees", "Greater Swiss Mountain Dog", "Ibizan Hound", "Irish Setter",
    "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound",
    "Japanese Chin", "Kerry Blue Terrier", "Labrador Retriever",
    "Lakeland Terrier", "Leonberger", "Lhasa Apso", "Maltese",
    "Xoloitzcuintli", "Newfoundland", "Norfolk Terrier", "Norwegian Elkhound",
    "Norwich Terrier", "Old English Sheepdog", "Pekingese", "Pembroke Welsh Corgi",
    "Pomeranian", "Rhodesian Ridgeback", "Rottweiler",
    "Saint Bernard", "Saluki", "Samoyed", "Scottish Terrier",
    "Scottish Deerhound", "Sealyham Terrier", "Shetland Sheepdog",
    "Shih Tzu", "Siberian Husky", "Staffordshire Bull Terrier",
    "Sussex Spaniel", "Tibetan Mastiff", "Tibetan Terrier",
    "Treeing Walker Coonhound", "Weimaraner", "Welsh Springer Spaniel",
    "West Highland White Terrier", "Yorkshire Terrier", "Affenpinscher",
    "Basenji", "Basset Hound", "Beagle",
    "Black and Tan Coonhound", "Bloodhound", "Bluetick Coonhound",
    "Borzoi", "Boxer", "Briard",
    "Bullmastiff", "Cairn Terrier", "Chow Chow",
    "Clumber Spaniel", "Cocker Spaniel", "Collie",
    "Curly-coated Retriever", "Dhole", "Dingo",
    "Flat-coated Retriever", "Giant Schnauzer", "Golden Retriever",
    "Belgian Sheepdog", "Keeshond", "Australian Kelpie",
    "Komondor", "Kuvasz", "Alaskan Malamute",
    "Belgian Malinois", "Miniature Pinscher", "Miniature Poodle",
    "Miniature Schnauzer", "Otterhound", "Papillon", "Pug",
    "Redbone Coonhound", "Schipperke", "Silky Terrier",
    "Soft Coated Wheaten Terrier", "Standard Poodle", "Standard Schnauzer",
    "Toy Poodle", "Toy Terrier", "Vizsla", "Whippet",
    "Wire Fox Terrier"
]