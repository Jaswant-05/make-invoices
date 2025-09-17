export default function PDFError({ message }: { message: string }) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-red-500">
        {message}
      </div>
    );
  }