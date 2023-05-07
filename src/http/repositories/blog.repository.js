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
        component: 'lifestyle',
        configuration: {
          image: 'https://images.unsplash.com/photo-1490129375591-2658b3e2ee50?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=2244&amp;q=80',
          title: 'A taste of every lifestyle',
          button: {
            label: 'Read the blog',
            link: '#blog',
          },
          external_links: [
            {
              label: 'Find out more',
              link: '#pages/about-us'
            },
            {
              label: 'Get in touch',
              link: '#contact'
            },
          ]
        },
      },
      {
        component: 'grid',
        configuration: {
          title: 'This is my second post',
          text: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
          button: {
            label: 'Read more',
            link: '#blog/my-third-big-post/'
          },
          image: {
            src: 'https://images.unsplash.com/photo-1521145239174-279dc2227166?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80',
            link: '#blog/my-third-big-post/'
          }
        },
      },
      {
        component: 'endless',
        configuration: {
          title: 'Endlessly customizable',
          text: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.',
          button: {
            label: 'Find out more',
            link: '#pages/about-us'
          },
          image: 'https://images.unsplash.com/photo-1503516459261-40c66117780a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1949&amp;q=80'
        },
      },
      {
        component: 'love',
        configuration: {
          title: 'We love to travel',
          text: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'
        },
      },
      {
        component: 'footer',
        configuration: {
          title: 'impulse',
          links: [
            {
              header: 'More info',
              items: [
                {
                  label: 'Learning Center',
                  link: '#learning_center',
                },
                {
                  label: 'Forum',
                  link: '#forum',
                },
                {
                  label: 'API',
                  link: '#api',
                },
              ]
            },
            {
              header: 'Helpful Links',
              items: [
                {
                  label: 'Support',
                  link: '#support',
                },
                {
                  label: 'Contact US',
                  link: '#contact_us',
                },
                {
                  label: 'Map',
                  link: '#map',
                },
              ]
            },
            {
              header: 'Find out more',
              items: [
                {
                  label: 'Store',
                  link: '#store',
                },
                {
                  label: 'Trade',
                  link: '#trade',
                },
                {
                  label: 'FAQ',
                  link: '#faq',
                },
              ]
            },
          ],
          copyright: '©2021 DESIGN BY NOVOLIO. IMAGES BY UNSPLASH'
        },
      },
      // {
      //   component: 'slider',
      //   configuration: {
      //     images: ['image_one', 'image_two', 'image_three'],
      //   },
      // },
      // {
      //   component: 'hero',
      //   configuration: {
      //     title: 'This is a Hero!',
      //   },
      // },
    ],
  }
}

module.exports = {
  blogPostDataRepository,
}
