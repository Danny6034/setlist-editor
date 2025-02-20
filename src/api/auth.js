
var client_secret = process.env.VUE_APP_CLIENT_SECRET; //From Your Spotify App
var client_id = process.env.VUE_APP_CLIENT_ID; //From Your Spotify App
const redirect_uri = "http://localhost:8080/"; //This must match the redirect URI you setup in your App on the Spotify API Dashboard.

var access_token = null;
var refresh_token = null;

var playlists = null;
var trackData;

const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const USER = 'https://api.spotify.com/v1/me';
const TOKEN = 'https://accounts.spotify.com/api/token'
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
var TRACKS = "https://api.spotify.com/v1/playlists/";
var playlistName = "";


export function requestOAuth() {
    console.log('requesting');

    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=True";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-read-collaborative"

    window.location.href = url;
    onPageLoad();
  }

  export function onPageLoad() {
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if (window.location.search.length > 0) {
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
    }
  }

function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri); //remove params from url

}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if (queryString.length >0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    console.log(code)
    return code;
}

function fetchAccessToken(code){
    console.log('fetching access token')
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {

    
    console.log('calling authorization api')
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    console.log('handling authorization response')
    if (this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function handleUserResponse() {
    if ( this.status == 200 ){
        console.log('handling user response')
        var data = JSON.parse(this.responseText);
        console.log(data);
        return data;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

export function refreshPlaylists() {
    callApi("GET", PLAYLISTS, null, handlePlaylistResponse)
}

function handlePlaylistResponse() {
    if ( this.status == 200 ){
        console.log('handling playlist response')
        var data = JSON.parse(this.responseText);
        console.log(data);
        //Send Playlist JSON to Local Storage
        localStorage.setItem("playlists", JSON.stringify(data));

        return data;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

export function refreshTracks() {
    var playlists = JSON.parse(localStorage.getItem("playlists"));
    var playlistList = playlists.items;

    playlistList.forEach(element => {
        let trackUrl = TRACKS + element.id + "/tracks";
        callApi("GET", trackUrl, null, function() {
            handleTracksResponse(this, element.id);
        });
    });
}

function handleTracksResponse(xhr, playlistId) {
    if (xhr.status == 200) {
        console.log("handling tracks response");
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        try{
            localStorage.setItem(`tracks_${playlistId}`, JSON.stringify(data));
        }
        catch(err){
            console.log(err);
        }
    } else if (xhr.status == 401) {
        refreshAccessToken();
    } else {
        console.log(xhr.responseText);
        alert(xhr.responseText);
    }
}


function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest;
    xhr.open(method, url, true)
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshAccessToken() {
    console.log('refreshing access token')
    refresh_token = localStorage.getItem("refresh_token");
    let body = 'grant_type=refresh_token';
    body += '&refresh_token=' + refresh_token;
    body += '&client_id=' + client_id;
    callAuthorizationApi(body);
}