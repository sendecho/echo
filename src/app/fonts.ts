import localFont from 'next/font/local'

export const headingFont = localFont({
  src: [
    {
      path: '../../public/fonts/PerfectlyNineties-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PerfectlyNineties-Italic.woff2',
      weight: '400',
      style: 'italic'
    },
  ]
})