import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "We could not load this page. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold text-amber-900">{title}</h1>
      <p className="max-w-md text-gray-600">{message}</p>
      <Link
        to="/"
        className="rounded bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-600"
      >
        Go home
      </Link>
    </main>
  );
};

export default ErrorPage;