import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Quiz from "./routes/Quiz";
import QuizResult from "./routes/QuizResult";
import Congrat from "./components/CongratModal";
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
        path: "congrat",
        element: <Congrat />,
      },
    ],
  },
]);

export default router;
