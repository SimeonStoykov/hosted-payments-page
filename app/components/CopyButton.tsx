interface CopyButtonProps {
  onClick: () => void;
  isCopied: boolean;
}

export function CopyButton({ onClick, isCopied }: CopyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-bvnk-blue hover:text-blue-700 text-sm font-medium transition-colors text-[15px] leading-[24px]"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
}
