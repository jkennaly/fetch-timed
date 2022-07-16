// src/services/fetchT.js

const headerBase = {
    "Content-Type": "application/json",
}

export default async function fetchWithTimeout(resource, options = {}) {
    const {
        timeout = 1000,
        token = '',
        gtt = '',
        headers: reqHeaders = {},
        ...fetchOptions
    } = options


    const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {}
    const gttHeader = gtt ? { 'X-GT-Access-Token': gtt } : {}
    const headers = new Headers({ ...headerBase, ...tokenHeader, ...gttHeader, ...reqHeaders })

    const finalOptions = { headers, ...fetchOptions }

    const controller = new AbortController()
    const id = setTimeout(() => {
        //console.log('fetchT timed out')
        return controller.abort()
    }, timeout)
    try {
        const response = await fetch(resource, {
            ...finalOptions,
            signal: controller.signal
        })
        clearTimeout(id)


        return response
    } catch (err) {
        return
    }
}
