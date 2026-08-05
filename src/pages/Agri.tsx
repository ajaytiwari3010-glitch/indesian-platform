import { getVertical } from '../lib/verticals'
import VerticalPage from '../components/VerticalPage'

export default function Agri() {
  const vertical = getVertical('agri')!
  return <VerticalPage vertical={vertical} />
}
