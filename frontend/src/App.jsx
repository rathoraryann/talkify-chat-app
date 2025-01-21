import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";
import NotFound from "./Pages/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login } from "./store/slice/userSlice";

function App() {
  const user = useSelector((state) => state.userSlice.status);
  const dispatch = useDispatch();
  const localStorageUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (localStorageUser) {
      dispatch(login({ data: localStorageUser }));
    }
  }, [localStorageUser, dispatch]);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to={"/chat"} /> : <Home />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to={"/"} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
