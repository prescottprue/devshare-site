import React from 'react'
import { Home } from 'routes/Home/components/Home'
import { shallow } from 'enzyme'

describe.skip('(Component) Home', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<Home />)
  })

  it('Renders devshare logo', () => {
    const logo = _component.find('img')
    expect(logo).to.exist
  })

  it('Renders description', () => {
    const welcome = _component.find('span')
    expect(welcome).to.exist
  })

})
