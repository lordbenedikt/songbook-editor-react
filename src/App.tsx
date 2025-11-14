import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SongEditor from './pages/editor/SongEditor';
import PrintPreview from './pages/preview/PrintPreview';

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="" element={<SongEditor />} />
                <Route path="page-preview" element={<PrintPreview />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;