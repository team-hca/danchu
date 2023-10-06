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
    errorElement: <Error />,
    children: [
      {
        path: "quiz",
        element: <Quiz />,
        errorElement: <Error />,
      },
      {
        path: "result",
        element: <QuizResult />,
        errorElement: <Error />,
      },
      {
        path: "congrat",
        element: <Congrat />,
        errorElement: <Error />,
      },
    ],
  },
]);

export default router;
