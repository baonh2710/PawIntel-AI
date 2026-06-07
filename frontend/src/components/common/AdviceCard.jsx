// Component phụ: Góc nhắc nhở (Tips & Advice)
export const AdviceCard = ({ icon, title, text, colorClass }) => (
  <div className={`p-4 rounded-3xl border border-transparent ${colorClass} transition-transform hover:scale-[1.01]`}>
    <div className="flex gap-3 items-start">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-sm font-medium leading-relaxed opacity-90">{text}</p>
      </div>
    </div>
  </div>
);
