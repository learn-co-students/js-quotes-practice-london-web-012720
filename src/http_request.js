class HTTPRequests {
   
    // Make an HTTP GET Request 
    get(url) {
      return new Promise((resolve, reject) => {
        fetch(url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
  
    // Make an HTTP POST Request
    post(url, data) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
  
     // Make an HTTP PUT Request
     // CHANGE TO method: "PATCH" for partial changes
     patch(url, data) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
      });
    }
  
    // Make an HTTP DELETE Request
    delete(url) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(() => resolve('Resource Deleted...'))
        .catch(err => reject(err));
      });
    }
}
