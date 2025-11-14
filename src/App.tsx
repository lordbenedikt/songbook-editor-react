import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import PagePreview from './preview/PagePreview';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/page-preview" element={<div>Hello there!</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;