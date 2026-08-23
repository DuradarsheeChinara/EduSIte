interface AnimatedBackgroundProps {
  src: string;
}

export function AnimatedBackground({ src }: AnimatedBackgroundProps) {
  return (
    <iframe
      src={`/backgrounds/${src}`}
      title="animated background"
      className="fixed inset-0 w-full h-full border-0 -z-10 pointer-events-none"
      loading="lazy"
    />
  );
}
