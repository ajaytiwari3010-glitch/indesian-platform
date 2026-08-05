import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Group from './pages/Group'
import DigitalOPD from './pages/DigitalOPD'
import Energy from './pages/Energy'
import Agri from './pages/Agri'
import Infra from './pages/Infra'
import PartnerWithUs from './pages/PartnerWithUs'
import Technology from './pages/Technology'
import InvestorOverview from './pages/InvestorOverview'
import Contact from './pages/Contact'
import LegalPage from './pages/LegalPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/group" element={<Group />} />
        <Route path="/opd" element={<DigitalOPD />} />
        <Route path="/energy" element={<Energy />} />
        <Route path="/agri" element={<Agri />} />
        <Route path="/infra" element={<Infra />} />
        <Route path="/partner" element={<PartnerWithUs />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/investor" element={<InvestorOverview />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/disclaimer" element={<LegalPage type="disclaimer" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
