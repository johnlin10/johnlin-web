import style from '../../Project.module.scss'
import { Link } from 'react-router-dom'

import { db } from '../../../../firebase'
import { doc, deleteDoc } from 'firebase/firestore'
import { storage } from '../../../../firebase'
import { ref, deleteObject, listAll } from 'firebase/storage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faTrash,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'

import { useSprings, animated } from '@react-spring/web'

function List({ isAdmin, projects, setProjects }) {
  // animation
  const _spring_project_list = useSprings(
    projects.length,
    projects.map((_, index) => ({
      from: { opacity: 0, transform: 'translateY(20%)' },
      to: { opacity: 1, transform: 'translateY(0)' },
      delay: 70 * index,
      config: { duration: 100 },
    }))
  )

  const handleDelete = async (projectId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this project? This action is irreversible.'
      )
    ) {
      try {
        // delete project document in firestore
        await deleteDoc(doc(db, 'projects', projectId))

        // delete all related files in storage
        const storageRef = ref(storage, `projects/${projectId}`)
        const fileList = await listAll(storageRef)
        const deletePromises = fileList.items.map((fileRef) =>
          deleteObject(fileRef)
        )
        await Promise.all(deletePromises)

        // update local state
        setProjects(projects.filter((project) => project.id !== projectId))

        alert('Project deleted successfully')
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Error deleting project, please try again later')
      }
    }
  }

  return (
    <div className={style.projectList}>
      <div
        className={style.projectListContent}
        initial={{ opacity: 0, y: '10%' }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ul>
          {projects
            ?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
            .map((project, index) => {
              if (project.private && !isAdmin) {
                return null
              }
              return (
                <animated.li
                  key={project.id}
                  style={_spring_project_list[index]}
                  className={project.private ? style.private : ''}
                >
                  <Link to={`/project/${project.id}`}>
                    <h3>
                      {project.private ? <FontAwesomeIcon icon={faLock} /> : ''}
                      {project.name}
                    </h3>
                    <p className={style.description}>{project.description}</p>
                    <p className={style.publishDate}>
                      {project.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </Link>
                  {isAdmin && (
                    <button
                      className={style.deleteButton}
                      onClick={() => handleDelete(project.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </animated.li>
              )
            })}
        </ul>
      </div>
      {isAdmin && (
        <Link to="/create-project" className={style.createProject}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </Link>
      )}
    </div>
  )
}

export default List
