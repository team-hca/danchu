import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Quiz from "./routes/Quiz";
import QuizResult from "./routes/QuizResult";
import Error from "./routes/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "quiz",
        element: <Quiz />,
      },
      {
        path: "result",
        element: <QuizResult />,
      },
      {
        path: "error",
        element: <Error />,
      },
    ],
  },
]);

export default router;
