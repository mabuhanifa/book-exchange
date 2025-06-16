interface ErrorMessageProps {
  error: string | object | null;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  let message = "An unknown error occurred.";
  if (typeof error === "string") {
    message = error;
  } else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message;
  } else if (error && typeof error === "object") {
    message = JSON.stringify(error); // Fallback for complex errors
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
}
