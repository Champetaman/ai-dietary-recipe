export function ClayBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,146,0.14),transparent_30%),linear-gradient(180deg,#050507_0%,#090909_45%,#050507_100%)]" />
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(61,58,57,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(61,58,57,0.24)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,217,146,0.8),transparent)]" />
      <div className="absolute -left-[12%] top-[-8%] h-[36rem] w-[36rem] rounded-full bg-[#00d992]/10 blur-3xl animate-signal-drift" />
      <div className="absolute right-[-8%] top-[16%] h-[30rem] w-[30rem] rounded-full bg-[#2fd6a1]/8 blur-3xl animate-signal-drift-delayed" />
      <div className="absolute bottom-[-14%] left-[18%] h-[24rem] w-[24rem] rounded-full bg-white/4 blur-3xl animate-signal-float" />
    </div>
  );
}
