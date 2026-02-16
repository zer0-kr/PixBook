interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[10px] text-brown md:hidden">
          픽북
        </span>
        <h1 className="font-pixel text-xs text-brown mx-auto md:mx-0 md:text-sm">
          {title}
        </h1>
        {/* Spacer for centering on mobile */}
        <div className="w-12 md:hidden" />
      </div>
    </header>
  );
}
