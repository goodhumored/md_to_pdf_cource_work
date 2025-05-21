import { useEffect, useState } from "react";

export default function Toast({
  id,
  message,
  isError,
  duration,
  onClose,
}: {
  id: string;
  message: string;
  isError: boolean;
  duration: number;
  onClose: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose(id);
      }, 300); // Соответствует длительности анимации
      return () => clearTimeout(timer);
    }
  }, [isVisible, id, onClose]);

  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-lg max-w-xs transition-all duration-300 transform ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 text-sm font-semibold hover:text-gray-900"
      >
        ✕
      </button>
    </div>
  );
}
