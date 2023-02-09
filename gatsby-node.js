const PocketBase = require('pocketbase/cjs')

exports.sourceNodes = (
  { actions: { createNode }, createNodeId, createContentDigest, reporter },
  pluginOptions
) => {
  reporter.log("Connected to Pocketbase")
  const serverOptions = pluginOptions.server || {
    protocol: "http",
    address: `127.0.0.1`,
    port: 8090,
  }

  const pb = new PocketBase(
    `${serverOptions.protocol}://${serverOptions.address}:${serverOptions.port}`
  )
  return pb.admins
    .authWithPassword(pluginOptions.auth.user, pluginOptions.auth.password)
    .then(() => {
      reporter.log("Getting tables from pocketbase")
      return pb.collections
        .getFullList()
        .then(collections => {
          return Promise.all(
            collections.map(col =>
              createNodes(
                pb,
                pluginOptions,
                createNode,
                createNodeId,
                col.name,
                createContentDigest
              )
            )
          )
        })
        .catch(err => {
          pb.cancelAllRequests()
          console.warn(err)
          return err
        })
    })
    .catch(e => {
      pb.authStore.clear()
      console.warn(e)
      throw e
    })
}

const createNodes = (
  db,
  pluginOptions,
  createNode,
  createNodeId,
  collectionName,
  createContentDigest
) => {
  return db
    .collection(collectionName)
    .getFullList()
    .then(items => {
      items.forEach(({ id, ...item }) => {
        const node = {
          ...item,
          id: createNodeId(id),
          pocketbase_id: id,
          parent: `__${collectionName}__`,
          children: [],
          internal: {
            type: `pocketbase${collectionName.toUpperCase()}`,
            content: JSON.stringify(item),
            contentDigest: createContentDigest(item),
          },
        }
        console.log(node)
        createNode(node)
        return
      })
    })
    .catch(e => {
      console.warn(e)
      throw e
    })
}
