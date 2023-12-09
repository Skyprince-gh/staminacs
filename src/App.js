import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Reset from "./Pages/Auth/Reset";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./util/firebase-auth";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { actions as authActions } from "./store/auth";
import {
  getAllDocuments,
  getDocumentByID,
  setDocument,
} from "./util/firebase-store";
import Homepage from "./Pages/Homepage";

//This component is where it all begins. Contains the routes to the different pages
//in the app.

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.userAuthCred);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(authActions.setUserAuthState(true));
        dispatch(authActions.setUserAuthCred(user));

        getDocumentByID("Users", user.uid).then((docSnap) => {
          const docData = docSnap.data();
          console.log(docData);

          dispatch(authActions.setUserData(docData));
        });

        getAllDocuments("Users", user.uid, "Inventory").then((allDocuments) => {
          const obj = { "000": "" };
          allDocuments.forEach((document) => {
            obj[`${document.id}`] = {
              name: document.name,
              altName: document.altName,
              id: document.id,
              productCode: document.productCode,
              description: document.description,
            };
          });

          console.log("new index list:", obj);
          sessionStorage.setItem("search Indexes", JSON.stringify(obj));
          setDocument(obj, "Users", user.uid, "SearchIndexes", "Init");
        });
      } else {
        dispatch(authActions.setUserAuthState(false));
        // navigate("/signin");
      }
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        {isAuthenticated === false && (
          <Route path="/" element={<Homepage />} exact />
        )}
        {isAuthenticated === false && (
          <Route path="/signin" element={<Login />} exact />
        )}
        {isAuthenticated === true && (
          <Route
            path="/signin"
            element={<Navigate to="/dashboard/home" />}
            exact
          />
        )}
        {isAuthenticated === false && (
          <Route path="/signup" element={<Signup />} exact />
        )}
        {isAuthenticated === true && (
          <Route path="/signup" element={<Navigate to="/dashboard/home" />} />
        )}
        {isAuthenticated === false && (
          <Route path="/signin/forgotten-password" element={<Reset />} exact />
        )}
        {/* {isAuthenticated === true && <Route path="/dashboard/inventory/*" element={<Dashboard/>} />} */}
        {isAuthenticated === true && (
          <Route path="/dashboard/*" element={<Dashboard />} />
        )}
        {/* {isAuthenticated === true && <Route path="/dashboard/home" element={<Dashboard/>} />} */}
      </Routes>
    </div>
  );
}

export default App;
