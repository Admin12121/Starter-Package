import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import { getToken } from "@/api/service/localStorageServices";

import Pagenotfound from "@/pages/empty/pagenotfound";
import { Toaster } from "sonner";
import Spinner from "@/components/ui/spinner";
import Home from "@/pages/home/index"
import Dashboard from "@/pages/dashboard/dashboard";

function App() {
  const { access_token } = getToken();

  const routes = useMemo(
    () => (

        <Routes>
          <Route index element={<Home/>} />
          <Route path="dashboard" element={ <Dashboard /> } >
          </Route>
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
    ),
    [ access_token]
  );

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            height: "50px",
            padding: "10px",
          },
        }}
        icons={{ loading: <Spinner /> }}
        invert={true}
        pauseWhenPageIsHidden={true}
        theme="system"
        position="top-right"
      />
      {routes}
    </>
  );
}

export default App;
