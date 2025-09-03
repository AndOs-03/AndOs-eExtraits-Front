import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NotFound from "./pages/OtherPage/NotFound";
import Accueil from "./pages/Accueil.tsx";
import Centres from "./pages/Centres/Centres.tsx";
import Institutions from "./pages/Institutions/Institutions.tsx";
import ExtraitsDeces from "./pages/ExtraitsDeces/ExtraitsDeces.tsx";
import ExtraitsMariages from "./pages/ExtraitsMariages/ExtraitsMariages.tsx";
import ExtraitsNaissances from "./pages/ExtraitsNaissances/ExtraitsNaissances.tsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Parametrage et Extraits */}
          <Route element={<AppLayout />}>
            {/* Pages de paramétrage */}
            <Route index path="/" element={<Accueil />} />
            <Route index path="/centres" element={<Centres />} />
            <Route index path="/institutions" element={<Institutions />} />

            {/* Pages de gestion des extraits */}
            <Route index path="/extraits-deces" element={<ExtraitsDeces />} />
            <Route index path="/extraits-mariages" element={<ExtraitsMariages />} />
            <Route index path="/extraits-naissance" element={<ExtraitsNaissances />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
