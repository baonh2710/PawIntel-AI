# app/core/config.py
import os

MODEL_PATH = "dog_breed_model.keras" # Bạn nhớ để file keras ngang hàng với thư mục app nhé
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "Chó săn Afghan", "Chó hoang châu Phi", "Chó sục Airedale", "Chó sục Staffordshire Mỹ",
    "Chó núi Appenzeller", "Chó sục Úc", "Chó sục Bedlington", "Chó núi Bern",
    "Chó Tây Ban Nha Blenheim", "Chó chăn cừu Border Collie", "Chó sục Border",
    "Chó Bull Boston", "Chó chăn bò Flanders", "Chó Griffon Bruxellois",
    "Chó săn Brittany", "Chó Corgi Cardigan", "Chó tha mồi vịnh Chesapeake",
    "Chó Chihuahua", "Chó sục Dandie Dinmont", "Chó Doberman", "Chó săn cáo Anh",
    "Chó săn chim kiểu Anh", "Chó Springer Spaniel Anh", "Chó núi Entlebucher",
    "Chó Eskimo", "Chó Bull Pháp (Bò Pháp)", "Chó chăn cừu Đức (Becgie)",
    "Chó săn Đức lông ngắn", "Chó săn chim Gordon", "Chó Great Dane (Ngao Đan Mạch)",
    "Chó núi Pyrenees", "Chó núi Thụy Sĩ lớn", "Chó săn Ibizan", "Chó săn chim Ireland",
    "Chó sục Ireland", "Chó săn nước Ireland", "Chó săn sói Ireland", "Chó săn xám Ý",
    "Chó Nhật (Japanese Chin)", "Chó sục xanh Kerry", "Chó tha mồi Labrador",
    "Chó sục Lakeland", "Chó Leonberger", "Chó Lhasa Apso", "Chó Malta",
    "Chó không lông Mexico", "Chó Newfoundland", "Chó sục Norfolk", "Chó săn nai Na Uy",
    "Chó sục Norwich", "Chó chăn cừu Anh cổ", "Chó Bắc Kinh", "Chó Corgi Pembroke",
    "Chó Phốc sóc (Pomeranian)", "Chó lông xoáy Nam Phi", "Chó Rottweiler",
    "Chó Saint Bernard", "Chó săn xám Saluki", "Chó Samoyed", "Chó sục Scotland",
    "Chó săn hươu Scotland", "Chó sục Sealyham", "Chó chăn cừu Shetland",
    "Chó Thạch Sư (Shih Tzu)", "Chó Husky Siberia (Ngáo)", "Chó sục bò Staffordshire",
    "Chó Sussex Spaniel", "Chó ngao Tây Tạng", "Chó sục Tây Tạng",
    "Chó săn Treeing Walker", "Chó săn Weimaraner", "Chó Springer Spaniel xứ Wales",
    "Chó sục trắng West Highland", "Chó sục Yorkshire", "Chó khỉ Affenpinscher",
    "Chó Basenji (Chó không sủa)", "Chó săn chân lùn Basset", "Chó săn thỏ Beagle",
    "Chó săn gấu mèo đen nâu", "Chó săn máu (Bloodhound)", "Chó săn gấu mèo Bluetick",
    "Chó săn xám Nga (Borzoi)", "Chó Boxer (Chó võ sĩ)", "Chó chăn cừu Briard",
    "Chó ngao bò (Bullmastiff)", "Chó sục Cairn", "Chó Chow Chow",
    "Chó Clumber Spaniel", "Chó Cocker Spaniel", "Chó chăn cừu Collie",
    "Chó tha mồi lông xoăn", "Chó sói đỏ (Sói lửa)", "Chó hoang Dingo",
    "Chó tha mồi lông phẳng", "Chó Schnauzer khổng lồ", "Chó tha mồi Golden",
    "Chó chăn cừu Groenendael", "Chó Keeshond", "Chó chăn cừu Kelpie",
    "Chó giẻ lau Komondor", "Chó chăn cừu Kuvasz", "Chó kéo xe Malamute (Alaska)",
    "Chó chăn cừu Malinois (Bỉ)", "Chó Phốc hươu", "Chó Poodle cỡ nhỏ",
    "Chó Schnauzer cỡ nhỏ", "Chó săn rái cá", "Chó bướm Papillon", "Chó mặt xệ Pug",
    "Chó săn gấu mèo Redbone", "Chó Schipperke", "Chó sục Silky Úc",
    "Chó sục Wheaten lông mềm", "Chó Poodle tiêu chuẩn", "Chó Schnauzer tiêu chuẩn",
    "Chó Poodle đồ chơi (Toy)", "Chó sục cảnh", "Chó săn Vizsla", "Chó săn xám Whippet",
    "Chó sục cáo lông cứng"
]