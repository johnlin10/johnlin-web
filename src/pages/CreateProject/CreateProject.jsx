import React, { useState } from 'react'
import style from './CreateProject.module.scss'
import { db, storage } from '../../firebase'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import getFileType from '../../utils/getFileType'
import { v4 as uuidv4 } from 'uuid'

function CreateProject() {
  const navigate = useNavigate()
  const [projectData, setProjectData] = useState({
    private: false,
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    authors: [''],
    tags: [''],
    customFields: [{ key: '', value: '' }],
    files: [],
  })
  const [selectedFileType, setSelectedFileType] = useState('file')
  const [showWebsiteInput, setShowWebsiteInput] = useState(false)

  const fileTypes = [
    { value: 'image', label: 'Image', accept: 'image/*' },
    { value: 'audio', label: 'Audio', accept: 'audio/*' },
    { value: 'web_video', label: 'Video', accept: 'video/*' },
    { value: 'file', label: 'Other Files', accept: '' },
    { value: 'website', label: 'Add Website', accept: '' },
  ]

  const handleFileTypeChange = (e) => {
    const newType = e.target.value
    setSelectedFileType(newType)
    setShowWebsiteInput(newType === 'website')
  }

  //* Info Inputs
  // handle input change
  const handleInputChange = (e, index, field) => {
    const { name, value, type, checked } = e.target
    const updatedData = { ...projectData }

    if (field === 'authors' || field === 'tags') {
      updatedData[field][index] = value
    } else if (field === 'customFields') {
      updatedData.customFields[index][name] = value
    } else if (type === 'checkbox') {
      updatedData[name] = checked
    } else {
      updatedData[name] = value
    }

    setProjectData(updatedData)
  }

  //* Fields
  // add field
  const addField = (field) => {
    setProjectData((prev) => ({
      ...prev,
      [field]:
        field === 'customFields'
          ? [...prev[field], { key: '', value: '' }]
          : [...prev[field], ''],
    }))
  }
  // remove field
  const removeField = (index, field) => {
    setProjectData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  //* Files
  // handle file change
  const handleFileChange = (e, fileType) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      type: fileType === 'file' ? getFileType(file.name) : fileType,
      name: file.name,
      file: file,
    }))
    setProjectData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }))
  }

  //* Website
  const [website, setWebsite] = useState({
    name: '',
    url: '',
  })
  const handleUrlAdd = () => {
    setProjectData((prev) => ({
      ...prev,
      files: [
        ...prev.files,
        { type: 'website', name: website.name, url: website.url },
      ],
    }))
    setWebsite({
      name: '',
      url: '',
    })
  }

  // remove file
  const removeFile = (index) => {
    setProjectData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  function generateShortId() {
    return uuidv4().replace(/-/g, '').substring(0, 12)
  }
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newProjectId = generateShortId()

    try {
      const fileUrls = await Promise.all(
        projectData.files.map(async (fileInfo) => {
          if (fileInfo.file) {
            const storageRef = ref(
              storage,
              `projects/${newProjectId}/${fileInfo.name}`
            )
            await uploadBytes(storageRef, fileInfo.file)
            const url = await getDownloadURL(storageRef)
            return { type: fileInfo.type, name: fileInfo.name, url: url }
          }
          return fileInfo
        })
      )

      await setDoc(doc(db, 'projects', newProjectId), {
        ...projectData,
        id: newProjectId,
        files: fileUrls,
        createdAt: serverTimestamp(),
      })

      navigate(`/project/${newProjectId}`)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  return (
    <div className={style.createProject}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className={style.name}
          value={projectData.name}
          onChange={(e) => handleInputChange(e)}
          placeholder="Name"
        />
        <textarea
          name="description"
          className={style.description}
          value={projectData.description}
          onChange={(e) => handleInputChange(e)}
          placeholder="Description"
        />
        <div className={style.detailsItem}>
          <div className={style.private}>
            <p>Private</p>
            <input
              type="checkbox"
              name="private"
              checked={projectData.private}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className={style.date}>
            <input
              type="date"
              name="startDate"
              value={projectData.startDate}
              onChange={(e) => handleInputChange(e)}
            />
            <input
              type="date"
              name="endDate"
              value={projectData.endDate}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className={style.fieldGroup}>
          <h3>Authors</h3>
          {projectData.authors.map((author, index) => (
            <div key={`author-${index}`}>
              <input
                type="text"
                value={author}
                onChange={(e) => handleInputChange(e, index, 'authors')}
                placeholder="Author"
              />
              <button
                type="button"
                onClick={() => removeField(index, 'authors')}
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addField('authors')}>
            Add Author
          </button>
        </div>

        <div className={style.fieldGroup}>
          <h3>Tags</h3>
          {projectData.tags.map((tag, index) => (
            <div key={`tag-${index}`}>
              <input
                type="text"
                value={tag}
                onChange={(e) => handleInputChange(e, index, 'tags')}
                placeholder="Tag"
              />
              <button type="button" onClick={() => removeField(index, 'tags')}>
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addField('tags')}>
            Add Tag
          </button>
        </div>

        <div className={style.fieldGroup}>
          <h3>Custom Fields</h3>
          {projectData.customFields.map((field, index) => (
            <div key={`custom-${index}`}>
              <input
                type="text"
                name="key"
                value={field.key}
                onChange={(e) => handleInputChange(e, index, 'customFields')}
                placeholder="Custom Field Name"
              />
              <input
                type="text"
                name="value"
                value={field.value}
                onChange={(e) => handleInputChange(e, index, 'customFields')}
                placeholder="Custom Field Value"
              />
              <button
                type="button"
                onClick={() => removeField(index, 'customFields')}
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addField('customFields')}>
            Add Custom Field
          </button>
        </div>

        <h3>Add Files or Websites</h3>
        <div className={style.fileUpload}>
          <select value={selectedFileType} onChange={handleFileTypeChange}>
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {selectedFileType !== 'website' && (
            <input
              type="file"
              accept={
                fileTypes.find((t) => t.value === selectedFileType)?.accept ||
                ''
              }
              multiple
              onChange={(e) => handleFileChange(e, selectedFileType)}
            />
          )}
        </div>

        {showWebsiteInput && (
          <div className={style.websiteInput}>
            <input
              type="text"
              placeholder="Website Name"
              value={website.name}
              onChange={(e) => setWebsite({ ...website, name: e.target.value })}
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={website.url}
              onChange={(e) => setWebsite({ ...website, url: e.target.value })}
            />
            <button type="button" onClick={handleUrlAdd}>
              Add Website
            </button>
          </div>
        )}

        <div className={style.addedFiles}>
          <h4>Added Files</h4>
          {projectData.files.map((file, index) => (
            <div key={`file-${index}`} className={style.fileItem}>
              <div className={style.fileInfo}>
                <span>{file.type}</span>
                <span>{file.name}</span>
              </div>
              <button type="button" onClick={() => removeFile(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  )
}

export default CreateProject
