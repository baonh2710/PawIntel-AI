# 🐾 PawIntel AI

Hệ thống nhận diện và phân tích thú cưng sử dụng AI.

Dự án được xây dựng theo kiến trúc **Microservices**, tách biệt rõ ràng giữa UI, API và AI model để dễ mở rộng và phát triển.

---

## 🧱 Kiến trúc hệ thống

```
Frontend (React)  →  Backend (Node.js API)  →  AI Service (Python)

```

| Layer      | Vai trò                        |
| ---------- | ------------------------------ |
| Frontend   | Giao diện người dùng           |
| Backend    | Xử lý logic, API trung gian    |
| AI Service | Xử lý model nhận diện thú cưng |

---

## 🛠️ Tech Stack & Công nghệ sử dụng

### 🎨 Frontend

- ⚛️ React (Vite)
- 🎨 Tailwind CSS v4 (styling)
- 🧩 shadcn/ui (UI components)
- 🌐 Fetch API (gọi API mặc định của trình duyệt)

👉 Mục tiêu:

- UI hiện đại, dễ mở rộng
- Component reusable
- Tối ưu performance với Vite

---

### 🌐 Backend (Node.js)

- 🟢 Node.js
- 🚀 Express.js
- 🔗 REST API
- 🌐 Axios (gọi API sang AI Service)
- 🌍 dotenv (quản lý biến môi trường)

👉 Mục tiêu:

- Làm cầu nối giữa Frontend và AI Service
- Xử lý request / response
- Dễ scale hoặc thêm auth sau này

---

### 🧠 AI Service (Python)

- 🐍 Python 3.9+
- ⚡ FastAPI (high-performance API)
- 🤖 TensorFlow / Keras (model `.h5`, `.keras`)
- 🔥 Uvicorn (ASGI server)

👉 Mục tiêu:

- Xử lý nhận diện hình ảnh thú cưng
- Trả kết quả phân tích cho Backend

---

## 🚀 Yêu cầu trước khi chạy

Cài sẵn:

- Node.js (>= 18)
- Python (>= 3.9)
- VSCode

---

## ⚡ Quick Start (Làm đúng từng bước là chạy được)

> ⚠️ Mỗi service chạy ở **1 terminal riêng trong VSCode**

---

## 📥 Bước 1: Clone project

```powershell
git clone https://github.com/baonh2710/PawIntel-AI.git
cd PawIntel-AI

```

---

## 🧠 Bước 2: Chạy AI Service (Python)

👉 Mở **Terminal 1**:

```powershell
cd python-backend

python -m venv venv
.\venv\Scripts\Activate

pip install -r requirements.txt

uvicorn main:app --reload --port 8000

```

✅ Server chạy tại: http://localhost:8000

👉 **GIỮ terminal này mở**

---

## 🌐 Bước 3: Chạy Backend (Node.js)

👉 Mở **Terminal 2**:

```powershell
cd backend

npm install

"PORT=3000" | Out-File -Encoding utf8 .env
"PYTHON_BACKEND_URL=http://localhost:8000" | Out-File -Encoding utf8 -Append .env

npm start

```

✅ Server chạy tại: http://localhost:3000

👉 **GIỮ terminal này mở**

---

## 🎨 Bước 4: Chạy Frontend (React + Vite)

👉 Mở **Terminal 3**:

```powershell
cd frontend

npm install

"VITE_API_URL=http://localhost:3000" | Out-File -Encoding utf8 .env

npm run dev

```

---

## 🎉 Kết quả

👉 http://localhost:5173

---

## ⚙️ Ports hệ thống

| Service    | Port |
| ---------- | ---- |
| Frontend   | 5173 |
| Backend    | 3000 |
| AI Service | 8000 |

---

## 📦 ENV mẫu

### backend/.env

```
PORT=3000
PYTHON_BACKEND_URL=http://localhost:8000

```

### frontend/.env

```
VITE_API_URL=http://localhost:3000

```

---

## ⚠️ Lưu ý quan trọng

### 1. PowerShell khác CMD

❌ KHÔNG dùng:

```
echo > .env

```

✅ Phải dùng:

```powershell
"TEXT" | Out-File .env

```

---

### 2. Không tự cài lại project

❌ KHÔNG chạy:

- npm init
- create vite
- shadcn init

---

### 3. Nếu lỗi

👉 Backend:

```powershell
rm -r node_modules
npm install

```

👉 Python:

```powershell
pip install --upgrade pip

```

👉 Port bị trùng:

- đổi port trong `.env`

---

## 🧠 Ghi chú kỹ thuật

### Tailwind CSS v4

- dùng `@tailwindcss/vite`
- KHÔNG dùng config v3
- file CSS:

```css
@import "tailwindcss";
```

---

### AI Model

- file `.h5`, `.keras` không push GitHub
- chia sẻ qua Google Drive

---

## 💡 Tips cho dev mới

- Luôn mở 3 terminal riêng
- Không tắt terminal khi đang chạy
- Code theo structure có sẵn (không tự tạo lại stack)
- Reuse component từ `shadcn/ui` thay vì viết lại từ đầu

---

## 🙌 Done

Chạy đủ 3 service → hệ thống hoạt động full 🚀

# 📂 Cấu trúc Repository (Repository Structure)

PawIntel-AI/
├── frontend/ # ⚛️ React + Vite + Shadcn UI (Client)
│ ├── public/ # Static assets (favicon, file tĩnh không qua build)
│ ├── src/
│ │ ├── assets/ # Images, fonts, global CSS
│ │ ├── components/ # UI Components tái sử dụng
│ │ │ ├── ui/ # Các component từ thư viện shadcn/ui
│ │ │ └── common/ # Các component tự build (Header, Footer, Layout...)
│ │ ├── hooks/ # Custom React hooks (vd: useAuth, useImageUpload)
│ │ ├── lib/ # Utility functions (vd: hàm merge class của shadcn)
│ │ ├── pages/ # Các trang chính của app (Home, Dashboard, Result)
│ │ ├── services/ # API calls (Cấu hình Axios, các hàm fetch data)
│ │ ├── App.jsx # Root component
│ │ └── main.jsx # Entry point
│ ├── .env.example # Tệp mẫu chứa tên các biến môi trường (KHÔNG chứa value thật)
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # 🟢 Node.js + Express (API Gateway / Business Logic)
│ ├── src/
│ │ ├── config/ # Cấu hình database, môi trường, constants
│ │ ├── controllers/ # Xử lý logic request/response cho từng route
│ │ ├── middlewares/ # Custom middleware (auth, check role, multer upload file)
│ │ ├── models/ # Định nghĩa Schema Database (Mongoose, Prisma...)
│ │ ├── routes/ # Định nghĩa các API endpoints
│ │ ├── services/ # Chứa business logic, tương tác DB hoặc gọi sang Python-Backend
│ │ └── utils/ # Các hàm helper dùng chung (format date, handle error)
│ ├── .env.example # Tệp mẫu biến môi trường cho Node.js
│ ├── package.json
│ └── server.js # Entry point khởi tạo server Express
│
├── python-backend/ # 🐍 Python (AI/ML Microservice)
│ ├── app/ # Thư mục source code chính
│ │ ├── api/ # Định nghĩa các route API (FastAPI hoặc Flask)
│ │ ├── core/ # Cấu hình hệ thống, logging
│ │ └── services/ # Script xử lý AI: load model, tiền xử lý ảnh, predict
│ ├── models/ # Thư mục chứa file weights (.keras, .h5)
│ │ # ⚠️ LƯU Ý: Thư mục này phải được thêm vào .gitignore
│ ├── .env.example
│ ├── requirements.txt # Danh sách dependencies (pip freeze)
│ └── main.py # Entry point chạy server Python
│
├── .gitignore # Gitignore tổng của toàn repo (node_modules, venv, .env, .keras...)
├── docker-compose.yml # (Tương lai) Script để chạy 3 service chỉ bằng 1 lệnh docker
└── README.md # Tài liệu hướng dẫn setup dự án
