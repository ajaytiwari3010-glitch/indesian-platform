import { getVertical } from '../lib/verticals'
import VerticalPage from '../components/VerticalPage'

export default function Energy() {
  const vertical = getVertical('energy')!
  return <VerticalPage vertical={vertical} />
}
