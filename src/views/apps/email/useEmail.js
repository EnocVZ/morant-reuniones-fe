import { destr } from 'destr'
import { db } from '@db/apps/email/db'

export const useEmail = () => {
  const route = useRoute('apps-email-filter')

  const updateEmails = async (ids, data) => {
    const emailIdsLocal = destr(ids)
      function updateMailData(email) {
        Object.assign(email, data)
      }
      db.emails.forEach(email => {
        if (emailIdsLocal.includes(email.id))
          updateMailData(email)
      })
      
      return true
  }

  const updateEmailLabels = async (ids, label) => {
    function updateMailLabels(email) {
      const labelIndex = email.labels.indexOf(label)
      if (labelIndex === -1)
        email.labels.push(label)
      else
        email.labels.splice(labelIndex, 1)
    }
    db.emails.forEach(email => {
      if (Array.isArray(ids) ? ids.includes(email.id) : ids === email.id)
        updateMailLabels(email)
    })
    
    return true
  }

  const emailMoveToFolderActions = [
    { action: 'inbox', icon: 'tabler-mail' },
    { action: 'spam', icon: 'tabler-alert-octagon' },
    { action: 'trash', icon: 'tabler-trash' },
  ]

  const labels = [
    {
      title: 'personal',
      color: 'success',
    },
    {
      title: 'company',
      color: 'primary',
    },
    {
      title: 'important',
      color: 'warning',
    },
    {
      title: 'private',
      color: 'error',
    },
  ]

  const resolveLabelColor = label => {
    if (label === 'personal')
      return 'success'
    if (label === 'company')
      return 'primary'
    if (label === 'important')
      return 'warning'
    if (label === 'private')
      return 'error'
    
    return 'secondary'
  }

  const shallShowMoveToActionFor = action => {
    if (action === 'trash')
      return route.params.filter !== 'trashed'
    else if (action === 'inbox')
      return !(route.params.filter === undefined || route.params.filter === 'sent' || route.params.filter === 'draft')
    else if (action === 'spam')
      return !(route.params.filter === 'spam' || route.params.filter === 'sent' || route.params.filter === 'draft')
    
    return false
  }

  const moveSelectedEmailTo = (action, selectedEmails) => {
    const dataToUpdate = {}
    if (action === 'inbox') {
      if (route.params.filter === 'trashed')
        dataToUpdate.isDeleted = false
      dataToUpdate.folder = 'inbox'
    }
    else if (action === 'spam') {
      if (route.params.filter === 'trashed')
        dataToUpdate.isDeleted = false
      dataToUpdate.folder = 'spam'
    }
    else if (action === 'trash') {
      dataToUpdate.isDeleted = true
    }
    updateEmails(selectedEmails, dataToUpdate)
  }

  return {
    labels,
    resolveLabelColor,
    shallShowMoveToActionFor,
    emailMoveToFolderActions,
    moveSelectedEmailTo,
    updateEmails,
    updateEmailLabels,
  }
}
