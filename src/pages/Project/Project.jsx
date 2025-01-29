import List from './ui/List/List'
import ContentBlock from './ui/ContentBlock/ContentBlock'
import { Helmet } from 'react-helmet-async'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import style from './Project.module.scss'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { db } from '../../firebase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import useAuth from '../../hooks/useAuth'

function Project() {
  const { t } = useTranslation()
  const { projectId } = useParams()
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)

  // fetch projects from firestore
  useEffect(() => {
    const projectsCollection = collection(db, 'projects')
    const fetchProjects = async () => {
      const projectSnapshot = await getDocs(projectsCollection)
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProjects(projectList)
    }
    fetchProjects()

    // set projects realtime listener
    // const unsubscribe = onSnapshot(projectsCollection, (snapshot) => {
    //   const updatedProjects = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }))
    //   setProjects(updatedProjects)
    // })
    // return () => unsubscribe()
  }, [])

  // if have projectId, set currentProject
  useEffect(() => {
    const project = projects.find((p) => p.id === projectId)
    setCurrentProject(project)
  }, [projectId, projects])

  //* render content
  const renderContent = () => {
    if (!projectId) {
      return (
        <div className={style.project}>
          <Helmet>
            <title>
              {t('project', { ns: 'header' })} | {t('title', { ns: 'header' })}
            </title>
          </Helmet>
          <List
            isAdmin={isAdmin}
            projects={projects}
            setProjects={setProjects}
          />
        </div>
      )
    }
    if (!currentProject) {
      return (
        <div className={style.notFoundProject}>
          <FontAwesomeIcon icon={faCircleExclamation} />
          <h1>{t('projectNotFound', { ns: 'project' })}</h1>
        </div>
      )
    }

    return (
      <ContentBlock projectId={projectId} currentProject={currentProject} />
    )
  }

  return <>{renderContent()}</>
}

export default Project
