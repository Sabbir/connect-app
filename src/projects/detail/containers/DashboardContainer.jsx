/**
 * DashboardContainer container
 * displays content of the Dashboard tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

import {
  filterReadNotifications,
  filterNotificationsByProjectId,
  filterProjectNotifications,
} from '../../../routes/notifications/helpers/notifications'
import { toggleNotificationRead, toggleBundledNotificationRead } from '../../../routes/notifications/actions'
import { updateProduct, fireProductDirty, fireProductDirtyUndo } from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import FeedContainer from './FeedContainer'
import Sticky from 'react-stickynode'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import TwoColsLayout from '../components/TwoColsLayout'
import SystemFeed from '../../../components/Feed/SystemFeed'
import WorkInProgress from '../components/WorkInProgress'

import {
  SYSTEM_USER,
  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_DRAFT,
} from '../../../config/constants'

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onNotificationRead = this.onNotificationRead.bind(this)
  }

  onNotificationRead(notification) {
    if (notification.bundledIds) {
      this.props.toggleBundledNotificationRead(notification.id, notification.bundledIds)
    } else {
      this.props.toggleNotificationRead(notification.id)
    }
  }

  render() {
    const {
      project,
      phases,
      currentMemberRole,
      isSuperUser,
      notifications,
      productTemplates,
      isProcessing,
      updateProduct,
      fireProductDirty,
      fireProductDirtyUndo,
      addProductAttachment,
      updateProductAttachment,
      removeProductAttachment,
    } = this.props

    // system notifications
    const notReadNotifications = filterReadNotifications(notifications.notifications)
    const unreadProjectUpdate = filterProjectNotifications(filterNotificationsByProjectId(notReadNotifications, project.id))
    const sortedUnreadProjectUpdates = _.orderBy(unreadProjectUpdate, ['date'], ['desc'])

    // work in progress phase
    // find active phase otherwise fallback to some draft phase
    const activePhase = phases && phases.length > 0 && (
      _.find(phases, { status: PROJECT_STATUS_ACTIVE }) ||
      _.find(phases, { status: PROJECT_STATUS_DRAFT })
    )

    const leftArea = (
      <ProjectInfoContainer
        currentMemberRole={currentMemberRole}
        project={project}
        isSuperUser={isSuperUser}
      />
    )

    return (
      <TwoColsLayout>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={60}>{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>

        <TwoColsLayout.Content>
          {unreadProjectUpdate.length > 0 &&
            <SystemFeed
              messages={sortedUnreadProjectUpdates}
              user={SYSTEM_USER}
              onNotificationRead={this.onNotificationRead}
            />
          }

          {activePhase &&
            <WorkInProgress
              productTemplates={productTemplates}
              currentMemberRole={currentMemberRole}
              isProcessing={isProcessing}
              isSuperUser={isSuperUser}
              project={project}
              phase={activePhase}
              updateProduct={updateProduct}
              fireProductDirty={fireProductDirty}
              fireProductDirtyUndo={fireProductDirtyUndo}
              addProductAttachment={addProductAttachment}
              updateProductAttachment={updateProductAttachment}
              removeProductAttachment={removeProductAttachment}
            />
          }

          <FeedContainer
            currentMemberRole={currentMemberRole}
            project={project}
            isSuperUser={isSuperUser}
          />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

const mapStateToProps = ({ notifications, projectState }) => ({
  notifications,
  productTemplates: projectState.productTemplates,
  isProcessing: projectState.processing,
  phases: projectState.phases,
})

const mapDispatchToProps = {
  toggleNotificationRead,
  toggleBundledNotificationRead,
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)