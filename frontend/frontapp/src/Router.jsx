import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Quiz from "./routes/Quiz";
import QuizResult from "./routes/QuizResult";

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
    ],
  },
]);

export default router;
