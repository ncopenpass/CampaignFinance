/**
 * @description Take a sortBy array from react-table and return a string we can pass to the api
 * @param {Array<{desc: boolean, id: string }>} sortBy
 * @returns {string | undefined}
 */
export const formatSortBy = (sortBy) => {
  if (!sortBy.length) {
    return undefined
  } else {
    const [newSort] = sortBy
    return newSort.desc ? `-${newSort.id}` : newSort.id
  }
}
