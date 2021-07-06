const cacheName='v1';
const cacheAssets=[
    '../../home/build/index.html',
    '../../home/build/index.css',
    '../../home/build/manifest.json',
    '../../about/build/about.html',
    '../../about/build/about.css',
    '../../team/build/team.html',
    '../../team/build/team.css',
    '../../journey/build/journey.html',
    '../../journey/build/journey.css'
];

//Call Install Event

self.addEventListener("install", function(event){
    console.log("Service Worker: Installed");

    event.waitUntil(
        caches
        .open(cacheName)
        .then(function(cache){
            console.log("Service Worker: Caching Files");
            cache.addAll(cacheAssets);
        }).then(function(){
            self.skipWaiting();
        })
    );
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
        fetch(event.request).catch(function(){
            caches.match(event.request);
        })
    )
});