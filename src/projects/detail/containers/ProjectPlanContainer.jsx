/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import { updateProduct, fireProductDirty, fireProductDirtyUndo, deleteProjectPhase } from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import TwoColsLayout from '../components/TwoColsLayout'
import ProjectPlanProgress from '../components/ProjectPlanProgress'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import { SCREEN_BREAKPOINT_MD, PHASE_STATUS_DRAFT } from '../../../config/constants'
import Sticky from 'react-stickynode'

const ProjectPlanContainer = (props) => {
  const {
    project,
    isSuperUser,
    isManageUser,
    currentMemberRole,
    phases
  } = props

  // manager user sees all phases
  // customer user doesn't see unplanned (draft) phases
  const visiblePhases = phases.filter((phase) => (
    isManageUser || phase.status !== PHASE_STATUS_DRAFT
  ))

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
              return <Sticky top={110}>{leftArea}</Sticky>
            } else {
              return leftArea
            }
          }}
        </MediaQuery>
      </TwoColsLayout.Sidebar>

      <TwoColsLayout.Content>
        {visiblePhases.length > 0 ? (
          [
            <ProjectPlanProgress phases={visiblePhases} project={project} key="progress" />,
            <ProjectStages
              {...{
                ...props,
                phases: visiblePhases,
              }}
              isManageUser={isManageUser}
              key="stages"
            />
          ]
        ) : (
          <ProjectPlanEmpty />
        )}

      </TwoColsLayout.Content>
    </TwoColsLayout>
  )
}

ProjectPlanContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
}

const mapStateToProps = ({ projectState }) => ({
  productTemplates: projectState.allProductTemplates,
  phases: projectState.phases
})

const mapDispatchToProps = {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
  deleteProjectPhase,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlanContainer)
