const blogPostDataRepository = async () => {
  return {
    editable: true,
    server_address: global.serverAddress,
    title: 'App Page',
    app: {
      title: 'Application Page',
    },
    elements: [
      {
        component: 'hiro',
        configuration: {
          title: 'This is a Hiro!',
        },
      },
      {
        component: 'hiro',
        configuration: {
          title: 'This is a Hiro!',
        },
      },
      {
        component: 'hiro',
        configuration: {
          title: 'This is a Hiro!',
        },
      },
      {
        component: 'hiro',
        configuration: {
          title: 'This is a Hiro!',
        },
      },
      {
        component: 'slider',
        configuration: {
          images: ['image_one', 'image_two', 'image_three'],
        },
      },
    ],
  }
}

module.exports = {
  blogPostDataRepository,
}
