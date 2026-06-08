export const CuteProgressBar = ({
  score,
  maxScore = 5,
  color = "bg-orange-400",
}) => {
  // Tính toán phần trăm dựa trên thang điểm 5
  const percent = (score / maxScore) * 100;

  return (
    <div className="w-full bg-slate-100 rounded-full h-3.5 mb-1 overflow-hidden shadow-inner">
      <div
        className={`${color} h-3.5 rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};
