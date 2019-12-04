export default function fetchData(url, data) {
  // Default options are marked with *
  const opt = {
    // body: JSON.stringify(data), // must match 'Content-Type' header
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, *omit
    headers: {
      'content-type': 'application/json'
    },
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow' // manual, *follow, error
    // referrer: 'no-referrer' // *client, no-referrer
  };

  if (data) {
    opt.method = 'POST';
    opt.body = JSON.stringify(data);
  }
  return fetch(url, opt).then(response => response.json()); // parses response to JSON
}
