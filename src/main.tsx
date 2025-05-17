import { createRoot } from 'react-dom/client'
import './index.css'
import Index from "./view";
// import Test from "./view/test.tsx";

createRoot(document.getElementById('root')!).render(
    <Index />
    // <Test />
)
