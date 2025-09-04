export const navItems = {
  menu: [
    {
      label: 'Home',
      href: '#',
      isCurrent: true,
    },
    {
      label: 'Products',
      submenu: [
        {
          label: 'Dashboard',
          href: '#',
        },
        {
          label: 'Earnings',
          href: '#',
        },
        {
          label: 'Downloads',
          subsubmenu: [
            {
              label: 'Overview',
              href: '#',
            },
            {
              label: 'My Downloads',
              href: '#',
            },
            {
              label: 'Billing',
              href: '#',
            },
          ],
        },
      ],
    },
    {
      label: 'Services',
      href: '#',
    },
    {
      label: 'Pricing',
      href: '#',
    },
    {
      label: 'Contact',
      href: '#',
    },
  ],
};