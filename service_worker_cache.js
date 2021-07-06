const cacheName='v2';


//Call Install Event
self.addEventListener("install", function(event){
    console.log("Service Worker: Installed");
});


//Call Activate Event
self.addEventListener("activate", function(event){
    console.log("Service Worker: Activated");
    //I am removing unwanted caches now
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames){
            return Promise.all(
                cacheNames
                .map(function(cache){
                    if(cache !== cacheName){
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache);
                    }
                })
            )
            })
        )
    
});

//Call Fetch Event
self.addEventListener("fetch", function(event){
    console.log("Service Worker:Fetching");

    event.respondWith(
        fetch(event.request)
        .then(function(res){
            //Make copy/clone of response from server
            const resClone=res.clone();
            //Open Cache
            caches
            .open(cacheName)
            .then(function(cache){
                //Add response to cache
                cache
                .put(event.request, resClone);
            });
            return res;
        }).catch(function(error){
            caches
            .match(event.request)
            .then(function(res){
                return res;
            })
        })
    )
})