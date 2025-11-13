interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`w-full max-w-4xl  mx-auto py-6 px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
