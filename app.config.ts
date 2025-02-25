export default defineAppConfig({
  ui: {
    primary: 'lime',
    gray: 'neutral',
     card:{
       background: 'bg-white dark:bg-gray-900',
       divide: 'divide-y divide-gray-200 dark:divide-gray-800',
       ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
       rounded: 'rounded-t-2xl',
       shadow: 'shadow',
       body: {
         base: '',
         background: '',
         padding: '',
       },
     },
    carousel:{
      indicators: {
        wrapper: 'absolute flex items-center justify-center gap-3 bottom-8 inset-x-0',
        base: 'h-2 w-8',
        active: 'bg-mainColor dark:bg-mainColor ',
        inactive: 'bg-gray-100 dark:bg-gray-100'
      },
    }
  }

})