import os
import io
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Dog Breed AI Microservice", version="1.0")

# ==========================================
# 1. CẤU HÌNH MÔ HÌNH & DANH SÁCH CLASS
# ==========================================
# Ưu tiên dùng .keras nếu bạn đang xài TensorFlow 2.13+
MODEL_PATH = "dog_breed_model.keras"
IMG_SIZE = (224, 224)

# Mảng này CHẮC CHẮN phải khớp 100% với thứ tự lúc train.
# Nếu bạn train 120 class, hãy copy đủ 120 tên vào đây theo đúng thứ tự alphabet của folder.
CLASS_NAMES = [
    "Chó săn Afghan",
    "Chó hoang châu Phi",
    "Chó sục Airedale",
    "Chó sục Staffordshire Mỹ",
    "Chó núi Appenzeller",
    "Chó sục Úc",
    "Chó sục Bedlington",
    "Chó núi Bern",
    "Chó Tây Ban Nha Blenheim",
    "Chó chăn cừu Border Collie",
    "Chó sục Border",
    "Chó Bull Boston",
    "Chó chăn bò Flanders",
    "Chó Griffon Bruxellois",
    "Chó săn Brittany",
    "Chó Corgi Cardigan",
    "Chó tha mồi vịnh Chesapeake",
    "Chó Chihuahua",
    "Chó sục Dandie Dinmont",
    "Chó Doberman",
    "Chó săn cáo Anh",
    "Chó săn chim kiểu Anh",
    "Chó Springer Spaniel Anh",
    "Chó núi Entlebucher",
    "Chó Eskimo",
    "Chó Bull Pháp (Bò Pháp)",
    "Chó chăn cừu Đức (Becgie)",
    "Chó săn Đức lông ngắn",
    "Chó săn chim Gordon",
    "Chó Great Dane (Ngao Đan Mạch)",
    "Chó núi Pyrenees",
    "Chó núi Thụy Sĩ lớn",
    "Chó săn Ibizan",
    "Chó săn chim Ireland",
    "Chó sục Ireland",
    "Chó săn nước Ireland",
    "Chó săn sói Ireland",
    "Chó săn xám Ý",
    "Chó Nhật (Japanese Chin)",
    "Chó sục xanh Kerry",
    "Chó tha mồi Labrador",
    "Chó sục Lakeland",
    "Chó Leonberger",
    "Chó Lhasa Apso",
    "Chó Malta",
    "Chó không lông Mexico",
    "Chó Newfoundland",
    "Chó sục Norfolk",
    "Chó săn nai Na Uy",
    "Chó sục Norwich",
    "Chó chăn cừu Anh cổ",
    "Chó Bắc Kinh",
    "Chó Corgi Pembroke",
    "Chó Phốc sóc (Pomeranian)",
    "Chó lông xoáy Nam Phi",
    "Chó Rottweiler",
    "Chó Saint Bernard",
    "Chó săn xám Saluki",
    "Chó Samoyed",
    "Chó sục Scotland",
    "Chó săn hươu Scotland",
    "Chó sục Sealyham",
    "Chó chăn cừu Shetland",
    "Chó Thạch Sư (Shih Tzu)",
    "Chó Husky Siberia (Ngáo)",
    "Chó sục bò Staffordshire",
    "Chó Sussex Spaniel",
    "Chó ngao Tây Tạng",
    "Chó sục Tây Tạng",
    "Chó săn Treeing Walker",
    "Chó săn Weimaraner",
    "Chó Springer Spaniel xứ Wales",
    "Chó sục trắng West Highland",
    "Chó sục Yorkshire",
    "Chó khỉ Affenpinscher",
    "Chó Basenji (Chó không sủa)",
    "Chó săn chân lùn Basset",
    "Chó săn thỏ Beagle",
    "Chó săn gấu mèo đen nâu",
    "Chó săn máu (Bloodhound)",
    "Chó săn gấu mèo Bluetick",
    "Chó săn xám Nga (Borzoi)",
    "Chó Boxer (Chó võ sĩ)",
    "Chó chăn cừu Briard",
    "Chó ngao bò (Bullmastiff)",
    "Chó sục Cairn",
    "Chó Chow Chow",
    "Chó Clumber Spaniel",
    "Chó Cocker Spaniel",
    "Chó chăn cừu Collie",
    "Chó tha mồi lông xoăn",
    "Chó sói đỏ (Sói lửa)",
    "Chó hoang Dingo",
    "Chó tha mồi lông phẳng",
    "Chó Schnauzer khổng lồ",
    "Chó tha mồi Golden",
    "Chó chăn cừu Groenendael",
    "Chó Keeshond",
    "Chó chăn cừu Kelpie",
    "Chó giẻ lau Komondor",
    "Chó chăn cừu Kuvasz",
    "Chó kéo xe Malamute (Alaska)",
    "Chó chăn cừu Malinois (Bỉ)",
    "Chó Phốc hươu",
    "Chó Poodle cỡ nhỏ",
    "Chó Schnauzer cỡ nhỏ",
    "Chó săn rái cá",
    "Chó bướm Papillon",
    "Chó mặt xệ Pug",
    "Chó săn gấu mèo Redbone",
    "Chó Schipperke",
    "Chó sục Silky Úc",
    "Chó sục Wheaten lông mềm",
    "Chó Poodle tiêu chuẩn",
    "Chó Schnauzer tiêu chuẩn",
    "Chó Poodle đồ chơi (Toy)",
    "Chó sục cảnh",
    "Chó săn Vizsla",
    "Chó săn xám Whippet",
    "Chó sục cáo lông cứng"
]

# Tải mô hình vào bộ nhớ (Global Scope)
if os.path.exists(MODEL_PATH):
    print(f"[AI Service] Đang tải mô hình từ {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("[AI Service] Tải mô hình thành công!")
else:
    raise FileNotFoundError(f"Không tìm thấy file mô hình tại {MODEL_PATH}.")


# ==========================================
# 2. ĐỊNH NGHĨA LƯỢC ĐỒ (SCHEMA) BẰNG PYDANTIC
# ==========================================
class BreedPrediction(BaseModel):
    breed: str
    confidence: float


class APIResponse(BaseModel):
    success: bool
    predictions: List[BreedPrediction]
    message: str


# ==========================================
# 3. HÀM TIỀN XỬ LÝ ẢNH CHUẨN EFFICIENTNET
# ==========================================
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        # Sử dụng io.BytesIO để đọc ảnh an toàn trên RAM
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize(IMG_SIZE)

        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Đặc thù của EfficientNet: Không chia / 255.0 vì layer Rescaling đã nằm trong model.
        return img_array
    except Exception as e:
        raise ValueError(f"Lỗi phân tích hình ảnh: {str(e)}")


# ==========================================
# 4. API ROUTER - XỬ LÝ YÊU CẦU
# ==========================================
@app.post("/predict", response_model=APIResponse)
async def predict_dog_breed(file: UploadFile = File(...), threshold: float = 0.35):
    """
    Nhận file ảnh từ Node.js/React, xử lý và trả về Top 3 giống chó.
    - threshold: Ngưỡng chấp nhận (dưới 35% sẽ coi như không nhận diện được).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận định dạng ảnh.")

    try:
        print(f"[AI Service] Đang phân tích ảnh: {file.filename}")

        # Đọc toàn bộ ảnh vào RAM
        image_bytes = await file.read()

        # Tiền xử lý
        input_data = preprocess_image(image_bytes)

        # Dự đoán
        predictions_distribution = model.predict(input_data, verbose=0)[0]

        # Lấy nhãn có xác suất cao nhất để kiểm tra ngưỡng (threshold filter)
        highest_idx = np.argmax(predictions_distribution)
        max_confidence = float(predictions_distribution[highest_idx])

        # Nếu AI không tự tin (ảnh không phải chó, ảnh mờ, hoặc giống lạ)
        if max_confidence < threshold:
            return APIResponse(
                success=False,
                predictions=[],
                message=f"Không thể nhận diện rõ ràng. Độ tin cậy cao nhất ({max_confidence*100:.1f}%) chưa đạt chuẩn.",
            )

        # Trích xuất Top 3 kết quả cao nhất (sắp xếp giảm dần)
        top_3_indices = np.argsort(predictions_distribution)[-3:][::-1]

        result_list = []
        for idx in top_3_indices:
            result_list.append(
                BreedPrediction(
                    breed=CLASS_NAMES[idx],
                    confidence=round(float(predictions_distribution[idx]), 4),
                )
            )

        return APIResponse(
            success=True, predictions=result_list, message="Nhận diện thành công."
        )

    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        print(f"[AI Service] Lỗi hệ thống: {e}")
        raise HTTPException(status_code=500, detail="Lỗi nội bộ máy chủ.")
    finally:
        # BẮT BUỘC: Giải phóng RAM để hệ thống không bị tràn bộ nhớ khi nhận nhiều request
        await file.close()


# ==========================================
# 5. KHỞI ĐỘNG SERVER
# ==========================================
if __name__ == "__main__":
    import uvicorn

    # Tắt reload=True trong môi trường có load model AI nặng
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
