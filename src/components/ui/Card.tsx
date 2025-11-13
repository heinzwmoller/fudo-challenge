export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden border-b border-gray-200 pb-2">
      {children}
    </div>
  );
}
