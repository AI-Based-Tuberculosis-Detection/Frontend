import { Route, Routes } from "react-router-dom";
import HomePage from "../components/HomePage";
import CheckerPage from "../components/CheckerPage";
import Members from "../components/Members";

const Routs = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/get-started" element={ <CheckerPage/> } />
            <Route path="/team" element={ <Members/> } />
        </Routes >
    );
}
export default Routs;   