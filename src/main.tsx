import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './global.css'
import Index from "./view";
import EntityView from "./view/entity_view.tsx";


createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            <Route path="/" element={<Index />}></Route>
            <Route path="/entity/:id" element={<EntityView />}></Route>
        </Routes>
    </Router>
)
