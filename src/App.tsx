import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import SplatViewer from './SplatViewer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="viewer/:splatId?" element={<SplatViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
