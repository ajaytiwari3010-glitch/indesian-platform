import { getVertical } from '../lib/verticals'
import VerticalPage from '../components/VerticalPage'

export default function DigitalOPD() {
  const vertical = getVertical('opd')!
  return <VerticalPage vertical={vertical} />
}
