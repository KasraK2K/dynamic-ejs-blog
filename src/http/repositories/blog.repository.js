const blogPostDataRepository = async () => {
  return {
    editable: true,
    server_address: process.env.SERVER_ADDRESS,
    title: 'App Page',
    app: {
      title: 'Application Page',
    },
    elements: [
      {
        component: 'hero',
        configuration: {
          title: 'This is a Hero!',
        },
      },
      {
        component: 'hero',
        configuration: {
          title: 'This is a Hero!',
        },
      },
      {
        component: 'hero',
        configuration: {
          title: 'This is a Hero!',
        },
      },
      {
        component: 'hero',
        configuration: {
          title: 'This is a Hero!',
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
