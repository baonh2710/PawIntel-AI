// Component phụ: Thanh phần trăm kẹo ngọt (Update sang tone Hồng/Rose)
export const CuteProgressBar = ({ percent, color = "bg-rose-400" }) => (
  <div className="w-full bg-rose-50 rounded-full h-3.5 mt-3 overflow-hidden shadow-inner">
    <div
      className={`${color} h-3.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
      style={{ width: `${percent}%` }}
    >
      {/* Hiệu ứng bóng bẩy nhẹ trên thanh progress */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/20 skew-x-[-20deg] transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
  </div>
);

