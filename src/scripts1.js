import { nip19, getBlankEvent, SimplePool } from "nostr-tools";
import { getValue, addRowTable } from './form.js';
const defaultRelays =
  ["wss://relay.damus.io",
    "wss://nostr-pub.wellorder.net",
    "wss://nostr-verified.wellorder.net",
    "wss://expensive-relay.fiatjaf.com",
    "wss://nostr-relay.wlvs.space"]


export const pool = new SimplePool();
let state = null;

window.addEventListener("load", async () => {
  console.log('a')
  if (!window.nostr) {
    alert("You need a NIP-07 browser extension (Alby, nos2x) to use this tool!");
    return;
  }

  const nostr = window.nostr;
  const pubkey = await nostr.getPublicKey();
  startPool(pubkey)
 
  const form = document.getElementById("form");
  restore()
  async function submitRelays() {	
    console.log('submit')
    var form = document.getElementById("myForm");
      const relaysObj = getValue()
      const event = getBlankEvent();
  
      event.kind = 10002;
      event.pubkey = await nostr.getPublicKey();
      // event.content = JSON.stringify(relaysObj);
      event.created_at = Math.floor(Date.now() / 1000);
      event.tags = relaysObj
  
      let storedEvent = JSON.stringify(event);
      localStorage.setItem('nip65Event', storedEvent);
  
  
      try {
        const signed = await nostr.signEvent(event);
        let pubs = pool.publish(defaultRelays, signed)
        pubs.on('ok', () => {
          console.log(`has accepted our event`)
        })
        pubs.on('failed', reason => {
          console.log(`failed to publish to : ${reason}`)
        })
  
        form.reset();
      } catch (error) {
        console.error(error);
      }
      // location.reload()
  
    }
  async function restore() {
    let nip65Event = JSON.parse(localStorage.getItem('nip65Event'))
    if (nip65Event != null) {
      
      populateRelays(nip65Event)
     
    }
  }
  async function parsenprofile() {
    let relays = [];
    let nprofile = document.getElementById("input-nprofile-area").value
    let { type, data } = nip19.decode(nprofile)

    if (type === 'nprofile' ) {
      if(data.pubkey!=pubkey){
        alert("This NProfile does not belong to your public key")
        relays = data.relays
      }
      relays = data.relays
    }
    else{
      return
    }
    if (relays.length == 1) {
      document.getElementsByName("relay")[0].value = relays[0]
    }
    else {
      document.getElementsByName("relay")[0].value = relays[0]
      // const keys = Object.keys(state.content);
      for (let i = 1; i < relays.length; i++) {
        addRowTable()
        document.getElementsByName("relay")[i].value = relays[i]
      }
    }
    
    
    

  }
  const profileBtn = document.getElementById("parse-nprofile-button");
  // const addButton = document.getElementById("add-button");
  const submitBtn = document.getElementById("submitRelaysBtn");


  submitBtn.addEventListener("click", submitRelays);
  profileBtn.addEventListener("click", parsenprofile);

  

});

export default async function startPool(pubkey) {
  const userRelays = await nostr?.getRelays?.() || [];
  const relays = defaultRelays;
  let sub = pool.sub(
    defaultRelays,
    [
      { authors: [pubkey], kinds: [0] }
    ]
  )
  for (const key in userRelays) {
    relays.set(key, userRelays[key]);
  }
  relays.forEach((policy, url) => {
    // pool.addRelay(url, policy);
  });
  console.log(`fetch metadata from ${pubkey}`);

}
function populateRelays(event, relay) {
  if (state && state.created_at > event.created_at) return;

  let tags = event.tags
  if (tags.length==0){
    return;
  }
  else {
    console.log(tags[0].includes('read'))
    document.getElementsByName("relay")[0].value =tags[0][1]||""
    document.getElementsByName("read")[0].checked = tags[0].includes('read')
    document.getElementsByName("write")[0].checked =tags[0].includes('write')
    // const keys = Object.keys(state.content);
    for (let i = 1; i < tags.length; i++) {
      addRowTable()
      console.log(Boolean(tags[i][3]))
      document.getElementsByName("relay")[i].value =tags[i][1]||""
      document.getElementsByName("read")[i].checked= tags[i].includes('read')
      document.getElementsByName("write")[i].checked =tags[i].includes('write')
  }

  
  }
}




/*
{
    "id": <32-bytes sha256 of the the serialized event data>
    "pubkey": <32-bytes hex-encoded public key of the event creator>,
    "created_at": <unix timestamp in seconds>,
    "kind": <integer>,
    "tags": [
      ["e", <32-bytes hex of the id of another event>, <recommended relay URL>],
      ["p", <32-bytes hex of the key>, <recommended relay URL>],
      ... // other kinds of tags may be included later
    ],
    "content": <arbitrary string>,
    "sig": <64-bytes signature of the sha256 hash of the serialized event data, which is the same as the "id" field>
  }
  */
const inputContainer = document.getElementById("input-container");


const subnprofile = document.getElementById("submit-nprofile-button");
const addButton = document.getElementById("add-button");
const submitButton = document.getElementById("submit-relay-button");

