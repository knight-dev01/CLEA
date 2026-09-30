import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { LangProvider } from './i18n';
import { Home, About, Media, Blog, Visit, Contact } from './pages/Main';
import Admin from './pages/Admin';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="media" element={<Media />} />
            <Route path="blog" element={<Blog />} />
            <Route path="visit" element={<Visit />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}
