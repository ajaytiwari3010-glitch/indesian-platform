import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Group from './pages/Group'
import OPD from './pages/OPD'
import Energy from './pages/Energy'
import Agri from './pages/Agri'
import Infra from './pages/Infra'
import Partner from './pages/Partner'
import Technology from './pages/Technology'
import Investor from './pages/Investor'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/opd" element={<OPD />} />
        <Route path="/energy" element={<Energy />} />
        <Route path="/agri" element={<Agri />} />
        <Route path="/infra" element={<Infra />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
