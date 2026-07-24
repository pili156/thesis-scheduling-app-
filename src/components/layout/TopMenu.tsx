interface TopMenuProps {
  title: string;
}

export function TopMenu({ title }: TopMenuProps) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
    </header>
  );
}
