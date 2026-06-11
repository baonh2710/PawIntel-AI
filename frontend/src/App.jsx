import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ImageAnalyzer } from "./pages/ImageAnalyzer";
import { BreedEncyclopedia } from "./pages/BreedEncyclopedia";
import { BreedProfile } from "./pages/BreedProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trạm chính: Tính năng upload nhận diện ảnh thông luồng AI */}
        <Route path="/" element={<ImageAnalyzer />} />

        {/* Trạm danh sách Bách khoa toàn thư + Lọc đa tầng */}
        <Route path="/breeds" element={<BreedEncyclopedia />} />

        {/* Trạm chi tiết tạp chí cún cưng theo Token Id */}
        <Route path="/breeds/:breedId" element={<BreedProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export { App };
