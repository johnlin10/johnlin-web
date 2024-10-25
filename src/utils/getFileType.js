const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase()
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac']
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov']
  const documentExtensions = ['pdf']
  const spreadsheetExtensions = ['xls', 'xlsx', 'ods', 'csv', 'docx', 'doc']
  const presentationExtensions = ['ppt', 'pptx', 'odp']
  const codeExtensions = [
    'py',
    'js',
    'html',
    'css',
    'json',
    'xml',
    'php',
    'java',
    'cpp',
    'c',
  ]

  if (imageExtensions.includes(extension)) return 'image'
  if (audioExtensions.includes(extension)) return 'audio'
  if (videoExtensions.includes(extension)) return 'web_video'
  if (documentExtensions.includes(extension)) return 'pdf'
  if (spreadsheetExtensions.includes(extension)) return 'file'
  if (presentationExtensions.includes(extension)) return 'file'
  if (codeExtensions.includes(extension)) return 'file'
  if (extension === 'zip') return 'file'
  return 'file'
}

export default getFileType
