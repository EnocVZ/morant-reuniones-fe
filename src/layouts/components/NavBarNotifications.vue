<script setup>
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import paypal from '@images/svg/paypal.svg'

const notifications = ref([
  {
    id: 1,
    img: avatar4,
    title: 'Notificación de flor',
    subtitle: '',
    time: 'Hoy',
    isSeen: true,
  },
  {
    id: 2,
    text: 'Tom Holland',
    title: 'Nuevo usuario registrado.',
    subtitle: 'Hace 5 horas',
    time: 'Ayer',
    isSeen: false,
  },
  {
    id: 3,
    img: avatar5,
    title: 'Nuevo deslave',
    subtitle: 'Tiene 5 notificación',
    time: 'hoy',
    isSeen: true,
  },
  // {
  //   id: 4,
  //   img: paypal,
  //   title: 'PayPal',
  //   subtitle: 'Received Payment',
  //   time: '25 May',
  //   isSeen: false,
  //   color: 'error',
  // },
  {
    id: 5,
    img: avatar3,
    title: 'Pedido recibido 📦',
    subtitle: 'Nuevo pedido recibido de Jose.',
    time: '19 de marzo',
    isSeen: true,
  },
])

const removeNotification = notificationId => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = notification => {
  if (!notification.isSeen)
    markRead([notification.id])
}
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
