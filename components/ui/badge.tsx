type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-300 ring-1 ring-slate-700">
      {children}
    </span>
  );
}
