import reduxForm from './reduxForm'
import { initGA } from './analytics'
import { initRaven } from './errors'

export const initScripts = () => {
  initRaven()
  initGA()
}

export { reduxForm }

export default { reduxForm, initScripts }
