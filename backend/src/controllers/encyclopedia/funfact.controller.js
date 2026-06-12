import { FunFactService } from '../../services/encyclopedia/funfact.service.js';

export const getRandomFact = async (req, res) => {
  try {
    const fact = await FunFactService.getRandomArchivalFact();

    if (!fact) {
      return res.status(404).json({
        success: false,
        message: "Chưa có Archival Fact nào trong cơ sở dữ liệu."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trích xuất Archival Fact ngẫu nhiên thành công.",
      data: fact
    });
  } catch (error) {
    console.error("🔴 [FunFact Controller Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: `Lỗi hệ thống khi lấy Fact: ${error.message}`
    });
  }
};