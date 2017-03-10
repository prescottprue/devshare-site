import React from 'react'
import Navbar from '../../containers/Navbar/Navbar'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <section class="core">
    <Navbar />
    <section className={classes.mainContainer}>
      {children}
    </section>
  </section>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
