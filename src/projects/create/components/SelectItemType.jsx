import React from 'react'
import PT from 'prop-types'

import ProjectTypeCard from './ProjectTypeCard'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'

import ConnectLogoMono from '../../../assets/icons/connect-logo-mono.svg'
import { DOMAIN } from '../../../config/constants'

import './SelectItemType.scss'

function SelectItemType(props) {
  const cards = []

  props.projectTemplates.forEach((item) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (item.disabled || item.hidden) return

    const icon = <ProjectTypeIcon type={item.icon} />

    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={item.info || item.details}
        key={item.id}
        onClick={() => props.onProjectTypeChange(item.key || item.productKey)}
        type={item.name}
        buttonText={props.selectButtonTitle}
      />
    )
  })

  return (
    <div>
      <div className="header headerSelectItemType">
        <ConnectLogoMono className="icon-connect-logo-mono"/>
      </div>
      <div className="SelectItemType">
        <h1>{props.header}</h1>
        <div className="cards">{cards}</div>
        <div className="footer">
          Looking for something else? <a href={`https://${DOMAIN}/contact?utm_source=Connect&utm_medium=Referral&utm_campaign=FooterContact`}>Get in touch with us &rarr;</a>
        </div>
      </div>
    </div>
  )
}

SelectItemType.defaultProps = {
  header: '',
  selectButtonTitle: ''
}

SelectItemType.propTypes = {
  onProjectTypeChange: PT.func.isRequired,
  userRoles: PT.arrayOf(PT.string),
  projectTemplates: PT.array.isRequired,
  header: PT.string,
  selectButtonTitle: PT.string
}

export default SelectItemType
